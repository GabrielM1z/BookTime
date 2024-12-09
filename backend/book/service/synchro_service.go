package service

import (
	"book/model"
	"book/repository"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"slices"
	"time"

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

func (ss *SynchroService) whoDoWhichActions(filteredActions []model.Action) ([]model.Action, []model.Action, error) {
	type ObjectState struct {
		ObjectID uuid.UUID
		IdUser   uuid.UUID
		Table    string
		Data     map[string]interface{}
		LastDate time.Time
	}

	// Map pour suivre les suppressions par table, ID et utilisateur
	deletedObjects := make(map[string]map[uuid.UUID]map[uuid.UUID]bool) // table -> objectID -> userID -> deleted
	// Map pour stocker la dernière version des objets mis à jour
	lastUpdates := make(map[string]map[uuid.UUID]ObjectState) // table -> objectID -> ObjectState

	clientActions := []model.Action{}
	serverActions := []model.Action{}

	// Identifier les actions DELETE et marquer les objets comme supprimés
	for _, action := range filteredActions {
		if action.Type == "DELETE" {
			table := action.Table
			idUser := action.IdUser

			if _, ok := deletedObjects[table]; !ok {
				deletedObjects[table] = make(map[uuid.UUID]map[uuid.UUID]bool)
			}
			if _, ok := deletedObjects[table][action.IdAction]; !ok {
				deletedObjects[table][action.IdAction] = make(map[uuid.UUID]bool)
			}

			deletedObjects[table][action.IdAction][idUser] = true

			// Ajouter les actions DELETE à exécuter par l'autre partie
			if action.ExecutedBy == "SERVER" {
				clientActions = append(clientActions, action)
			} else {
				serverActions = append(serverActions, action)
			}
		}
	}

	// Traiter les INSERT et UPDATE
	for _, action := range filteredActions {
		table := action.Table
		idUser := action.IdUser

		if action.Type == "INSERT" {
			// Ne pas insérer si l'objet a un DELETE
			if deletedObjects[table][action.IdAction][idUser] {
				continue
			}

			// Ajouter les INSERT pour exécution
			if action.ExecutedBy == "SERVER" {
				clientActions = append(clientActions, action)
			} else {
				serverActions = append(serverActions, action)
			}
		} else if action.Type == "UPDATE" {
			// Les updates ne concernent que State et Library
			if table != "STATE" && table != "LIBRARY" {
				continue
			}

			// Ignorer les updates si un DELETE existe pour l'objet
			if deletedObjects[table][action.IdAction][idUser] {
				continue
			}

			// Décoder les données de l'UPDATE
			var data map[string]interface{}
			if err := json.Unmarshal(action.Action, &data); err != nil {
				return nil, nil, fmt.Errorf("erreur lors du décodage JSON : %w", err)
			}

			// Fusionner les updates en gardant la dernière version
			if _, ok := lastUpdates[table]; !ok {
				lastUpdates[table] = make(map[uuid.UUID]ObjectState)
			}
			if existing, ok := lastUpdates[table][action.IdAction]; ok {
				// Fusionner les données et mettre à jour la date si nécessaire
				for k, v := range data {
					existing.Data[k] = v
				}
				if action.Date.After(existing.LastDate) {
					existing.LastDate = action.Date
				}
				lastUpdates[table][action.IdAction] = existing
			} else {
				// Ajouter une nouvelle entrée pour l'objet
				lastUpdates[table][action.IdAction] = ObjectState{
					ObjectID: action.IdAction,
					IdUser:   idUser,
					Table:    action.Table,
					Data:     data,
					LastDate: action.Date,
				}
			}
		}
	}

	// Ajouter les mises à jour combinées à la liste des actions
	for table, updates := range lastUpdates {
		for _, state := range updates {
			actionData, err := json.Marshal(state.Data)
			if err != nil {
				return nil, nil, fmt.Errorf("erreur lors du réencodage JSON : %w", err)
			}
			clientActions = append(clientActions, model.Action{
				IdAction:   state.ObjectID,
				IdUser:     state.IdUser,
				Table:      table,
				Date:       state.LastDate,
				Type:       "UPDATE",
				Action:     actionData,
				ExecutedBy: "SERVER",
			})
			serverActions = append(serverActions, model.Action{
				IdAction:   state.ObjectID,
				IdUser:     state.IdUser,
				Table:      table,
				Date:       state.LastDate,
				Type:       "UPDATE",
				Action:     actionData,
				ExecutedBy: "CLIENT",
			})
		}
	}

	return serverActions, clientActions, nil
}

// Service principal pour chercher un livre
func (ss *SynchroService) Synchro(uuidUser uuid.UUID, client_actions []model.Action) ([]model.Action, error) {

	server_actions := repository.NewActionRepository(ss.DB).SelectActions(uuidUser)

	log.Println("PASS THERE")

	mixed_actions := slices.Concat(server_actions, client_actions)

	log.Println("PASS LA")

	filtered_actions, err := ss.filteredActions(mixed_actions)

	log.Println("PASS HERE")

	server_actions_to_exec, client_actions_to_exec, err := ss.whoDoWhichActions(filtered_actions)

	log.Println("SERVER ACTIONS exec :")
	log.Println(server_actions_to_exec)

	ss.executeActionsToSynchronizeServer(server_actions_to_exec)

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
			log.Println("PASS THERE STATE")
			log.Println(" action : ")
			log.Println(action)
			var state model.State
			err := json.Unmarshal(action.Action, &state)

			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON : %v", err)
			}

			var data map[string]interface{}
			erer := json.Unmarshal([]byte(action.Action), &data)
			if erer != nil {
				log.Fatalf("erreur lors du décodage JSON : %w", erer)
			}

			log.Println("state : ")
			log.Println(state)

			log.Println("state : ")
			log.Println(data)

			switch action.Type {
			case "INSERT":
				log.Println("PASS THERE STATE INSERT")
				if res := repository.NewStateRepository(ss.DB).InsertState(state); !res {
					return fmt.Errorf("insert failed for ID %s", action.IdAction)
				}
			case "UPDATE":
				log.Println("PASS THERE STATE U")
				if res := repository.NewStateRepository(ss.DB).UpdateState(state.IdUser, state.IdBook, state); !res {
					return fmt.Errorf("update failed for ID %s", action.IdAction)
				}
			case "DELETE":
				log.Println("PASS THERE STATE DEL")
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
