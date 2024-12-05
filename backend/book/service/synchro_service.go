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
)

type SynchroService struct {
	DB *sql.DB
}

func NewSynchroService(db *sql.DB) *SynchroService {
	return &SynchroService{DB: db}
}

func (ss *SynchroService) filteredActions(client_actions []model.Action) ([]model.Action, error) {
	return client_actions, nil
}

func (ss *SynchroService) Synchro(client_actions []model.Action) ([]model.Action, error) {

	server_actions := repository.NewActionRepository(ss.DB).SelectActions()

	mixed_actions := slices.Concat(server_actions, client_actions)

	client_actions_to_exec, err := ss.filteredActions(mixed_actions)

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
