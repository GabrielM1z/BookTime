package service

import (
	"book/model"
	"book/repository"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"slices"

	"book/service/interfaces"

	"github.com/google/uuid"
)

type SynchroService struct {
	DB *sql.DB
}

func NewSynchroService(db *sql.DB) *SynchroService {
	return &SynchroService{DB: db}
}

func (ss *SynchroService) filteredActions(mixed_actions []model.Action) ([]model.Action, error) {
	return mixed_actions, nil
}

func (ss *SynchroService) whoDoWhichActions(filtered_actions []model.Action) ([]model.Action, []model.Action, error) {

	//MANQUE DELETE DUPLIQUES SERV/TEL
	//MANQUE UPDATE MIX DERNIERES UPDATE

	type deletedLibraryBookActions struct {
		idBook    uuid.UUID
		idLibrary uuid.UUID
	}
	type deletedAction struct {
		deletedStateActions         []uuid.UUID
		deletedLibraryActions       []uuid.UUID
		deletedSharedLibraryActions []uuid.UUID
		deletedLibraryBookActions   []deletedLibraryBookActions
	}

	var deletedActions deletedAction
	var client_actions []model.Action
	var server_actions []model.Action

	// Fonction utilitaire pour vérifier si un UUID est dans une slice
	extractUUIDFromAction := func(actionData []byte, key string) (uuid.UUID, error) {
		var data map[string]interface{}
		err := json.Unmarshal(actionData, &data)
		if err != nil {
			return uuid.Nil, fmt.Errorf("erreur lors du décodage JSON : %w", err)
		}

		// Récupérer et convertir la valeur
		value, ok := data[key]
		if !ok {
			return uuid.Nil, fmt.Errorf("clé '%s' non trouvée dans l'action", key)
		}

		valueStr, ok := value.(string)
		if !ok {
			return uuid.Nil, fmt.Errorf("la clé '%s' n'est pas une chaîne", key)
		}

		id, err := uuid.Parse(valueStr)
		if err != nil {
			return uuid.Nil, fmt.Errorf("erreur lors de la conversion de '%s' en UUID : %w", valueStr, err)
		}

		return id, nil
	}

	addActionIdToDeletedList := func(deletedActions deletedAction, action model.Action) deletedAction {
		switch action.Table {
		case "STATE":
			idBook, err := extractUUIDFromAction(action.Action, "idBook")
			if err != nil {
				fmt.Println(err)
				return deletedActions
			}
			deletedActions.deletedStateActions = append(deletedActions.deletedStateActions, idBook)

		case "LIBRARY":
			idLibrary, err := extractUUIDFromAction(action.Action, "idLibrary")
			if err != nil {
				fmt.Println(err)
				return deletedActions
			}
			deletedActions.deletedLibraryActions = append(deletedActions.deletedLibraryActions, idLibrary)

		case "SHARED_LIBRARY":
			idLibrary, err := extractUUIDFromAction(action.Action, "idLibrary")
			if err != nil {
				fmt.Println(err)
				return deletedActions
			}
			deletedActions.deletedSharedLibraryActions = append(deletedActions.deletedSharedLibraryActions, idLibrary)

		case "LIBRARY_BOOK":
			idLibrary, err := extractUUIDFromAction(action.Action, "idLibrary")
			if err != nil {
				fmt.Println(err)
				return deletedActions
			}

			idBook, err := extractUUIDFromAction(action.Action, "idBook")
			if err != nil {
				fmt.Println(err)
				return deletedActions
			}

			deletedActions.deletedLibraryBookActions = append(deletedActions.deletedLibraryBookActions, deletedLibraryBookActions{
				idBook:    idBook,
				idLibrary: idLibrary,
			})
		}

		return deletedActions
	}

	contains := func(list []uuid.UUID, id uuid.UUID) bool {
		for _, v := range list {
			if v == id {
				return true
			}
		}
		return false
	}

	isDeleted := func(deletedActions deletedAction, table string, id uuid.UUID) bool {
		switch table {
		case "STATE":
			return contains(deletedActions.deletedStateActions, id)
		case "LIBRARY":
			return contains(deletedActions.deletedLibraryActions, id)
		case "SHARED_LIBRARY":
			return contains(deletedActions.deletedSharedLibraryActions, id)
		case "LIBRARY_BOOK":
			for _, deleted := range deletedActions.deletedLibraryBookActions {
				if deleted.idBook == id {
					return true
				}
			}
		}
		return false
	}

	// Premier passage : trier les actions DELETE et compter les IDs supprimés
	for _, action := range filtered_actions {
		if action.Type == "DELETE" {
			deletedActions = addActionIdToDeletedList(deletedActions, action)

			if action.ExecutedBy == "SERVER" {
				client_actions = append(client_actions, action)
			} else {
				server_actions = append(server_actions, action)
			}
		}
	}

	// Deuxième passage : trier INSERT et UPDATE, ignorer les IDs en doublons
	for _, action := range filtered_actions {
		if !isDeleted(deletedActions, action.Table, action.IdAction) {
			if action.Type == "INSERT" {
				if action.ExecutedBy == "SERVER" {
					client_actions = append(client_actions, action)
				} else {
					server_actions = append(server_actions, action)
				}
			} else if action.Type == "UPDATE" {
				client_actions = append(client_actions, action)
				server_actions = append(server_actions, action)
			}
		}
	}

	return server_actions, client_actions, nil
}

// Service principal pour chercher un livre
func (ss *SynchroService) Synchro(uuidUser uuid.UUID, client_actions []model.Action) ([]model.Action, error) {

	server_actions := repository.NewActionRepository(ss.DB).SelectActions(uuidUser)

	mixed_actions := slices.Concat(server_actions, client_actions)

	filtered_actions, err := ss.filteredActions(mixed_actions)

	server_actions_to_exec, client_actions_to_exec, err := ss.whoDoWhichActions(filtered_actions)

	log.Println(server_actions_to_exec)

	return client_actions_to_exec, err
}

func (ss *SynchroService) executeActionsToSynchronizeServer(clientActionsToExecute []model.Action) error {
	for _, action := range clientActionsToExecute {
		switch action.Table {
		case "LIBRARIES":
			var library model.Library
			err := json.Unmarshal([]byte(action.Action), &library)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON : %v", err)
			}
			switch action.Type {
			case "INSERT":
				if res := repository.NewLibraryRepository(ss.DB).InsertLibrary(library, action.IdUser); !res {
					return fmt.Errorf("insert failed for ID %s", action.IdAction)
				}
			case "UPDATE":
				if res := repository.NewLibraryRepository(ss.DB).UpdateLibrary(library, action.IdUser); !res {
					return fmt.Errorf("update failed for ID %s", action.IdAction)
				}
			case "DELETE":
				if res := repository.NewLibraryRepository(ss.DB).DeleteLibrary(library.IdLibrary, action.IdUser); !res {
					return fmt.Errorf("delete failed for ID %s", action.IdAction)
				}
			default:
				return fmt.Errorf("Unknown action's Type '%s' for ID %s", action.Type, action.IdAction)
			}

		case "LIBRARY_BOOK":
			var libraryBook model.PostLibraryBook
			err := json.Unmarshal([]byte(action.Action), &libraryBook)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON : %v", err)
			}
			switch action.Type {
			case "INSERT":
				if res := repository.NewLibraryBookRepository(ss.DB).InsertLibraryBook(libraryBook, action.IdUser); !res {
					return fmt.Errorf("insert failed for ID %s", action.IdAction)
				}
			case "DELETE":
				if res := repository.NewLibraryBookRepository(ss.DB).DeleteLibraryBook(libraryBook.LibraryId, libraryBook.BookId, action.IdUser); !res {
					return fmt.Errorf("delete failed for ID %s", action.IdAction)
				}
			default:
				return fmt.Errorf("unknown action type '%s' for ID %s", action.Type, action.IdAction)
			}

		case "SHARED_LIBRARY":
			var sharedLibrary model.PostSharedLibrary
			err := json.Unmarshal([]byte(action.Action), &sharedLibrary)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON : %v", err)
			}
			switch action.Type {
			case "INSERT":
				if res := repository.NewSharedLibraryRepository(ss.DB).InsertSharedLibrary(sharedLibrary, action.IdUser); !res {
					return fmt.Errorf("insert failed for ID %s", action.IdAction)
				}
			case "DELETE":
				if res := repository.NewSharedLibraryRepository(ss.DB).DeleteSharedLibrary(action.IdUser, sharedLibrary.IdLibrary); !res {
					return fmt.Errorf("delete failed for ID %s", action.IdAction)
				}
			default:
				return fmt.Errorf("unknown action type '%s' for ID %s", action.Type, action.IdAction)
			}

		case "STATE":
			var state model.State
			err := json.Unmarshal([]byte(action.Action), &state)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON : %v", err)
			}
			switch action.Type {
			case "INSERT":
				if res := repository.NewStateRepository(ss.DB).InsertState(state); !res {
					return fmt.Errorf("insert failed for ID %s", action.IdAction)
				}
			case "UPDATE":
				if res := repository.NewStateRepository(ss.DB).UpdateState(state.IdUser, state.IdBook, state); !res {
					return fmt.Errorf("update failed for ID %s", action.IdAction)
				}
			case "DELETE":
				if res := repository.NewStateRepository(ss.DB).DeleteState(state.IdBook, state.IdUser); !res {
					return fmt.Errorf("delete failed for ID %s", action.IdAction)
				}
			default:
				return fmt.Errorf("Unknown action's Type '%s' for ID %s", action.Type, action.IdAction)
			}
		default:
			return fmt.Errorf("Unknown action's Table name '%s' for ID %s", action.Table, action.IdAction)
		}
	}

	return nil
}

var _ interfaces.SynchroServiceInterface = &SynchroService{}
