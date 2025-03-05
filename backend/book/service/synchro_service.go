package service

import (
	"book/model"
	"book/repository"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"slices"
	"sort"
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

type libraryActionInfo struct {
	ActionId uuid.UUID
	Name     string
	Date     time.Time
}

type stateProgressionActionInfo struct {
	ActionId    uuid.UUID
	Progression uint
	Date        time.Time
}

type stateIsAvailableActionInfo struct {
	ActionId    uuid.UUID
	IsAvailable bool
	Date        time.Time
}

type stateLastReadDateActionInfo struct {
	ActionId     uuid.UUID
	LastReadDate string
	Date         time.Time
}

type stateReadCountActionInfo struct {
	ActionId  uuid.UUID
	ReadCount uint
	Date      time.Time
}

type stateRateActionInfo struct {
	ActionId uuid.UUID
	Rate     uint
	Date     time.Time
}

type stateCommentActionInfo struct {
	ActionId uuid.UUID
	Comment  string
	Date     time.Time
}

type stateStateActionInfo struct {
	ActionId uuid.UUID
	State    string
	Date     time.Time
}

// Vérifie si un uuid.UUID est présent dans une slice
func contains[T comparable](list []T, item T) bool {
	for _, element := range list {
		if element == item {
			return true
		}
	}
	return false
}

// Vérifie si un model.LibraryBook est présent dans une slice
func containsLibraryBook(list []model.LibraryBook, item model.LibraryBook) bool {
	for _, elem := range list {
		if elem.IdBook == item.IdBook && elem.LibraryId == item.LibraryId {
			return true
		}
	}
	return false
}

func (ss *SynchroService) whoDoWhichActions(filteredActions []model.Action) ([]model.Action, []model.Action, error) {

	clientActions := []model.Action{}
	serverActions := []model.Action{}

	// var updateStateActions []model.Action
	updateStateActions := make(map[uuid.UUID]model.Action)
	updateLibraryActions := make(map[uuid.UUID]model.Action)

	// var updateLibraryActions []model.Action
	var insertActions []model.Action
	var deleteActions []model.Action
	var deletedLibraries uuid.UUIDs
	var deletedStates []string
	var deletedSharedLibraries uuid.UUIDs
	var deletedLibrariesBooks []model.LibraryBook

	//On met chaque action dans une liste qui regroupe toutes les actions de meme type UPDATE INSERT DELETE
	for _, action := range filteredActions {
		if action.Type == "UPDATE" {
			if action.TableName == "STATE" {
				updateStateActions[action.IdAction] = action
			} else if action.TableName == "LIBRARY" {
				updateLibraryActions[action.IdAction] = action
			}
		} else if action.Type == "INSERT" {
			insertActions = append(insertActions, action)
		} else if action.Type == "DELETE" {
			deleteActions = append(deleteActions, action)
		}
	}

	// --== DELETE ==--

	// On initialise des maps pour détecter les doublons.
	deletedLibrariesMap := make(map[uuid.UUID]bool)
	deletedStatesMap := make(map[string]bool)
	deletedLibrariesBooksMap := make(map[model.LibraryBook]bool)
	deletedSharedLibrariesMap := make(map[uuid.UUID]bool)

	// On initialise des listes temporaires pour filtrer les actions.
	var filteredServerActions, filteredClientActions []model.Action

	// On met chaque action DELETE dans une liste des actions à exécuter pour le CLIENT ou SERVER
	for _, action := range deleteActions {
		var isDuplicate bool // Indicateur de doublon

		if action.TableName == "LIBRARY" {
			var library model.Library
			var unescapedAction string
			err := json.Unmarshal(action.Action, &unescapedAction)
			if err != nil {
				log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
			}
			err = json.Unmarshal([]byte(unescapedAction), &library)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON  lib del : %v", err)
			}

			deletedLibraries = append(deletedLibraries, library.IdLibrary)

			if deletedLibrariesMap[library.IdLibrary] {
				isDuplicate = true // Doublon détecté
			} else {
				deletedLibrariesMap[library.IdLibrary] = true
			}

		} else if action.TableName == "STATE" {
			var state model.State
			var unescapedAction string
			err := json.Unmarshal(action.Action, &unescapedAction)
			if err != nil {
				log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
			}
			err = json.Unmarshal([]byte(unescapedAction), &state)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON  lib harry : %v", err)
			}

			deletedStates = append(deletedStates, state.IdBook)

			if deletedStatesMap[state.IdBook] {
				isDuplicate = true // Doublon détecté
			} else {
				deletedStatesMap[state.IdBook] = true
			}

		} else if action.TableName == "LIBRARY_BOOK" {
			var libraryBook model.LibraryBook
			var unescapedAction string
			err := json.Unmarshal(action.Action, &unescapedAction)
			if err != nil {
				log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
			}
			err = json.Unmarshal([]byte(unescapedAction), &libraryBook)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON  lib harry : %v", err)
			}

			libraryBookKey := model.LibraryBook{LibraryId: libraryBook.LibraryId, IdBook: libraryBook.IdBook}

			deletedLibrariesBooks = append(deletedLibrariesBooks, libraryBookKey)

			if deletedLibrariesBooksMap[libraryBookKey] {
				isDuplicate = true // Doublon détecté
			} else {
				deletedLibrariesBooksMap[libraryBookKey] = true
			}

		} else if action.TableName == "SHARED_LIBRARY" {
			var sharedLibrary model.SharedLibrary
			var unescapedAction string
			err := json.Unmarshal(action.Action, &unescapedAction)
			if err != nil {
				log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
			}
			err = json.Unmarshal([]byte(unescapedAction), &sharedLibrary)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON  lib harry : %v", err)
			}

			deletedSharedLibraries = append(deletedSharedLibraries, sharedLibrary.IdLibrary)

			if deletedSharedLibrariesMap[sharedLibrary.IdLibrary] {
				isDuplicate = true // Doublon détecté
			} else {
				deletedSharedLibrariesMap[sharedLibrary.IdLibrary] = true
			}
		}

		// Ajout aux listes si pas de doublon
		if !isDuplicate {
			if action.ExecutedBy == "CLIENT" {
				filteredServerActions = append(filteredServerActions, action)
			} else if action.ExecutedBy == "SERVER" {
				filteredClientActions = append(filteredClientActions, action)
			}
		}
	}

	// Mise à jour des listes d'actions après suppression des doublons
	serverActions = append(serverActions, filteredServerActions...)
	clientActions = append(clientActions, filteredClientActions...)

	// --== INSERT ==--

	//On met chaque action INSERT dans une liste des actions a executer pour le CLIENT ou SERVER si l'objet n'est pas dans la liste des objets supprimes
	for _, action := range insertActions {

		if action.TableName == "LIBRARY" {

			var library model.Library
			var unescapedAction string
			err := json.Unmarshal(action.Action, &unescapedAction)
			if err != nil {
				log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
			}
			err = json.Unmarshal([]byte(unescapedAction), &library)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON ici : %v", err)
			} else if !contains(deletedLibraries, library.IdLibrary) {
				if action.ExecutedBy == "CLIENT" {
					serverActions = append(serverActions, action)
				} else if action.ExecutedBy == "SERVER" {
					clientActions = append(clientActions, action)
				}
			}
		} else if action.TableName == "STATE" {
			var state model.State
			var unescapedAction string
			err := json.Unmarshal(action.Action, &unescapedAction)
			if err != nil {
				log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
			}
			err = json.Unmarshal([]byte(unescapedAction), &state)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON  lib harry : %v", err)
			} else if !contains(deletedStates, state.IdBook) {
				if action.ExecutedBy == "CLIENT" {
					serverActions = append(serverActions, action)
				} else if action.ExecutedBy == "SERVER" {
					clientActions = append(clientActions, action)
				}
			}
		} else if action.TableName == "LIBRARY_BOOK" {
			var libraryBook model.LibraryBook
			var unescapedAction string
			err := json.Unmarshal(action.Action, &unescapedAction)
			if err != nil {
				log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
			}
			err = json.Unmarshal([]byte(unescapedAction), &libraryBook)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON  lib harry : %v", err)
			} else if !containsLibraryBook(deletedLibrariesBooks, model.LibraryBook{LibraryId: libraryBook.LibraryId, IdBook: libraryBook.IdBook}) {
				if action.ExecutedBy == "CLIENT" {
					serverActions = append(serverActions, action)
				} else if action.ExecutedBy == "SERVER" {
					clientActions = append(clientActions, action)
				}
			}
		} else if action.TableName == "SHARED_LIBRARY" {
			var sharedLibrary model.SharedLibrary
			var unescapedAction string
			err := json.Unmarshal(action.Action, &unescapedAction)
			if err != nil {
				log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
			}
			err = json.Unmarshal([]byte(unescapedAction), &sharedLibrary)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON  lib harry : %v", err)
			} else if !contains(deletedSharedLibraries, sharedLibrary.IdLibrary) {
				if action.ExecutedBy == "CLIENT" {
					serverActions = append(serverActions, action)
				} else if action.ExecutedBy == "SERVER" {
					clientActions = append(clientActions, action)
				}
			}
		}
	}

	// --== UPDATE ==--

	//LIBRARY
	libraryiesActionsInfos := make(map[uuid.UUID]libraryActionInfo)
	// dict{idlibrary OBJET(idaction  name date)}
	// si name correspond au last update DEVICE alors rien
	// Sinon ajout a la liste !DEVICE
	for _, action := range updateLibraryActions {
		var library model.Library
		var unescapedAction string
		err := json.Unmarshal(action.Action, &unescapedAction)
		if err != nil {
			log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
		}
		err = json.Unmarshal([]byte(unescapedAction), &library)
		if err != nil {
			log.Fatalf("Erreur lors du décodage du JSON  lib harry : %v", err)
		}
		if !contains(deletedLibraries, library.IdLibrary) {
			if _, exists := libraryiesActionsInfos[library.IdLibrary]; exists {
				if action.Date.After(libraryiesActionsInfos[library.IdLibrary].Date) {
					libraryiesActionsInfos[library.IdLibrary] = libraryActionInfo{action.IdAction, library.Name, action.Date}
				}
			} else {
				libraryiesActionsInfos[library.IdLibrary] = libraryActionInfo{action.IdAction, library.Name, action.Date}
			}
		}
	}

	for _, action := range libraryiesActionsInfos {
		actionToAdd := updateLibraryActions[action.ActionId]
		if actionToAdd.ExecutedBy == "CLIENT" {
			serverActions = append(serverActions, actionToAdd)
		} else if actionToAdd.ExecutedBy == "SERVER" {
			clientActions = append(clientActions, actionToAdd)
		}
	}

	//STATE
	statesProgressionActionsInfos := make(map[string]stateProgressionActionInfo)
	statesIsAvailableActionInfo := make(map[string]stateIsAvailableActionInfo)
	statesLastReadDateActionInfo := make(map[string]stateLastReadDateActionInfo)
	statesReadCountActionInfo := make(map[string]stateReadCountActionInfo)
	statesRateActionInfo := make(map[string]stateRateActionInfo)
	statesCommentActionInfo := make(map[string]stateCommentActionInfo)
	statesStateActionInfo := make(map[string]stateStateActionInfo)

	var actionList []model.Action
	for _, action := range updateStateActions {
		actionList = append(actionList, action)
	}

	sort.Slice(actionList, func(i, j int) bool {
		return actionList[i].Date.After(actionList[j].Date)
	})

	// Parcourir les actions dans l'ordre chronologique inverse
	for _, action := range actionList {
		// var stateActionData map[string]interface{}
		// err := json.Unmarshal(action.Action, &stateActionData)
		// if err != nil {
		// 	log.Fatalf("Erreur lors du décodage du JSON : %v", err)
		// }

		var stateActionData map[string]interface{}
		var unescapedAction string
		err := json.Unmarshal(action.Action, &unescapedAction)
		if err != nil {
			log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
		}
		err = json.Unmarshal([]byte(unescapedAction), &stateActionData)
		if err != nil {
			log.Fatalf("Erreur lors du décodage du JSON  lib harry : %v", err)
		}

		// Vérifie si "book_id" existe
		if idBook, ok := stateActionData["id_book"]; ok {
			idBook, ok := idBook.(string)
			if !ok {
				log.Fatalf("Erreur : id_book n'est pas une chaîne de caractères")
			}
			if !contains(deletedStates, idBook) {

				// Vérifie et met à jour les différentes propriétés de l'état
				if progression, ok := stateActionData["progression"]; ok {
					progressionUint, ok := progression.(float64)
					if !ok {
						log.Fatalf("Erreur : progression n'est pas un nombre valide")
					}
					if _, exists := statesProgressionActionsInfos[idBook]; !exists {
						statesProgressionActionsInfos[idBook] = stateProgressionActionInfo{
							ActionId:    action.IdAction,
							Progression: uint(progressionUint),
							Date:        action.Date,
						}
					}
				}

				if isAvailable, ok := stateActionData["is_available"]; ok {
					isAvailableBool, ok := isAvailable.(bool)
					if !ok {
						log.Fatalf("Erreur : is_available n'est pas un booléen")
					}
					if _, exists := statesIsAvailableActionInfo[idBook]; !exists {
						statesIsAvailableActionInfo[idBook] = stateIsAvailableActionInfo{
							ActionId:    action.IdAction,
							IsAvailable: isAvailableBool,
							Date:        action.Date,
						}
					}
				}

				if lastReadDate, ok := stateActionData["last_read_date"]; ok {
					lastReadDateStr, ok := lastReadDate.(string)
					if !ok {
						log.Fatalf("Erreur : last_read_date n'est pas une chaîne valide")
					}
					if _, exists := statesLastReadDateActionInfo[idBook]; !exists {
						statesLastReadDateActionInfo[idBook] = stateLastReadDateActionInfo{
							ActionId:     action.IdAction,
							LastReadDate: lastReadDateStr,
							Date:         action.Date,
						}
					}
				}

				if readCount, ok := stateActionData["read_count"]; ok {
					readCountFloat, ok := readCount.(float64)
					if !ok {
						log.Fatalf("Erreur : read_count n'est pas un nombre valide")
					}
					if _, exists := statesReadCountActionInfo[idBook]; !exists {
						statesReadCountActionInfo[idBook] = stateReadCountActionInfo{
							ActionId:  action.IdAction,
							ReadCount: uint(readCountFloat),
							Date:      action.Date,
						}
					}
				}

				if rate, ok := stateActionData["rate"]; ok {
					rateFloat, ok := rate.(float64)
					if !ok {
						log.Fatalf("Erreur : rate n'est pas un nombre valide")
					}
					if _, exists := statesRateActionInfo[idBook]; !exists {
						statesRateActionInfo[idBook] = stateRateActionInfo{
							ActionId: action.IdAction,
							Rate:     uint(rateFloat),
							Date:     action.Date,
						}
					}
				}

				if comment, ok := stateActionData["comment"]; ok {
					commentStr, ok := comment.(string)
					if !ok {
						log.Fatalf("Erreur : comment n'est pas une chaîne valide")
					}
					if _, exists := statesCommentActionInfo[idBook]; !exists {
						statesCommentActionInfo[idBook] = stateCommentActionInfo{
							ActionId: action.IdAction,
							Comment:  commentStr,
							Date:     action.Date,
						}
					}
				}

				if state, ok := stateActionData["state"]; ok {
					stateStr, ok := state.(string)
					if !ok {
						log.Fatalf("Erreur : state n'est pas une chaîne valide")
					}
					if _, exists := statesStateActionInfo[idBook]; !exists {
						statesStateActionInfo[idBook] = stateStateActionInfo{
							ActionId: action.IdAction,
							State:    stateStr,
							Date:     action.Date,
						}
					}
				}
			}
		}
	}

	// Ajout des actions à exécuter sans doublons
	uniqueActions := make(map[uuid.UUID]model.Action)

	for _, action := range statesProgressionActionsInfos {
		uniqueActions[action.ActionId] = updateStateActions[action.ActionId]
	}

	for _, action := range statesIsAvailableActionInfo {
		uniqueActions[action.ActionId] = updateStateActions[action.ActionId]
	}

	for _, action := range statesLastReadDateActionInfo {
		uniqueActions[action.ActionId] = updateStateActions[action.ActionId]
	}

	for _, action := range statesReadCountActionInfo {
		uniqueActions[action.ActionId] = updateStateActions[action.ActionId]
	}

	for _, action := range statesRateActionInfo {
		uniqueActions[action.ActionId] = updateStateActions[action.ActionId]
	}

	for _, action := range statesCommentActionInfo {
		uniqueActions[action.ActionId] = updateStateActions[action.ActionId]
	}

	for _, action := range statesStateActionInfo {
		uniqueActions[action.ActionId] = updateStateActions[action.ActionId]
	}

	// Convertir la map en slice et trier par ordre chronologique
	var actionsToExecute []model.Action
	for _, action := range uniqueActions {
		actionsToExecute = append(actionsToExecute, action)
	}

	sort.Slice(actionsToExecute, func(i, j int) bool {
		return actionsToExecute[i].Date.Before(actionsToExecute[j].Date)
	})

	for _, action := range actionsToExecute {
		if action.ExecutedBy == "CLIENT" {
			serverActions = append(serverActions, action)
		} else if action.ExecutedBy == "SERVER" {
			clientActions = append(clientActions, action)
		}
	}

	return serverActions, clientActions, nil
}

// Service principal pour chercher un livre
func (ss *SynchroService) Synchro(uuidUser uuid.UUID, client_actions []model.Action, lastSyncDate string) ([]model.Action, error) {

	server_actions := repository.NewActionRepository(ss.DB).SelectActionsFromDate(uuidUser, lastSyncDate)

	mixed_actions := slices.Concat(server_actions, client_actions)

	fmt.Println("mixed_actions executed : ", mixed_actions)

	server_actions_to_exec, client_actions_to_exec, err := ss.whoDoWhichActions(mixed_actions)

	fmt.Println("whoDoWhichActions executed server_actions_to_exec : ", server_actions_to_exec)

	ss.executeActionsToSynchronizeServer(server_actions_to_exec)

	return client_actions_to_exec, err
}

func (ss *SynchroService) executeActionsToSynchronizeServer(clientActionsToExecute []model.Action) error {

	// Trier les actions par ordre chronologique
	sort.Slice(clientActionsToExecute, func(i, j int) bool {
		return clientActionsToExecute[i].Date.Before(clientActionsToExecute[j].Date)
	})

	for _, action := range clientActionsToExecute {
		switch action.TableName {
		case "LIBRARY":
			var library model.Library
			var unescapedAction string
			err := json.Unmarshal(action.Action, &unescapedAction)
			if err != nil {
				log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
			}
			err = json.Unmarshal([]byte(unescapedAction), &library)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON  lib harry : %v", err)
			}
			switch action.Type {
			case "INSERT":
				if res := repository.NewLibraryRepository(ss.DB).InsertLibrary(library, action.IdUser, action.Date); !res {
					return fmt.Errorf("insert failed for ID %s", action.IdAction)
				}
			case "UPDATE":
				if res := repository.NewLibraryRepository(ss.DB).UpdateLibrary(library, action.IdUser, action.Date); !res {
					return fmt.Errorf("update failed for ID %s", action.IdAction)
				}
			case "DELETE":
				if res := repository.NewLibraryRepository(ss.DB).DeleteLibrary(library.IdLibrary, action.IdUser, action.Date); !res {
					return fmt.Errorf("delete failed for ID %s", action.IdAction)
				}
			default:
				return fmt.Errorf("Unknown action's Type '%s' for ID %s", action.Type, action.IdAction)
			}

		case "LIBRARY_BOOK":
			var libraryBook model.LibraryBook
			var unescapedAction string
			err := json.Unmarshal(action.Action, &unescapedAction)
			if err != nil {
				log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
			}
			err = json.Unmarshal([]byte(unescapedAction), &libraryBook)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON  lib harry : %v", err)
			}
			switch action.Type {
			case "INSERT":
				if res := repository.NewLibraryBookRepository(ss.DB).InsertLibraryBook(libraryBook, action.IdUser, action.Date); !res {
					return fmt.Errorf("insert failed for ID %s", action.IdAction)
				}
			case "DELETE":
				if res := repository.NewLibraryBookRepository(ss.DB).DeleteLibraryBook(libraryBook.LibraryId, libraryBook.IdBook, action.IdUser, action.Date); !res {
					return fmt.Errorf("delete failed for ID %s", action.IdAction)
				}
			default:
				return fmt.Errorf("unknown action type '%s' for ID %s", action.Type, action.IdAction)
			}

		case "SHARED_LIBRARY":
			var sharedLibrary model.PostSharedLibrary
			var unescapedAction string
			err := json.Unmarshal(action.Action, &unescapedAction)
			if err != nil {
				log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
			}
			err = json.Unmarshal([]byte(unescapedAction), &sharedLibrary)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON  lib harry : %v", err)
			}
			switch action.Type {
			case "INSERT":
				if res := repository.NewSharedLibraryRepository(ss.DB).InsertSharedLibrary(sharedLibrary, action.IdUser, action.Date); !res {
					return fmt.Errorf("insert failed for ID %s", action.IdAction)
				}
			case "DELETE":
				if res := repository.NewSharedLibraryRepository(ss.DB).DeleteSharedLibrary(action.IdUser, sharedLibrary.IdLibrary, action.Date); !res {
					return fmt.Errorf("delete failed for ID %s", action.IdAction)
				}
			default:
				return fmt.Errorf("unknown action type '%s' for ID %s", action.Type, action.IdAction)
			}

		case "STATE":

			var state model.State
			var unescapedAction string
			err := json.Unmarshal(action.Action, &unescapedAction)
			if err != nil {
				log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
			}
			err = json.Unmarshal([]byte(unescapedAction), &state)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON  lib harry : %v", err)
			}

			switch action.Type {
			case "INSERT":
				if res := repository.NewStateRepository(ss.DB).InsertState(state, action.Date); !res {
					return fmt.Errorf("insert failed for ID %s", action.IdAction)
				}
			case "UPDATE":
				// var stateActionData map[string]interface{}
				// err := json.Unmarshal(action.Action, &stateActionData)
				// fmt.Println("stateActionData", stateActionData)
				// if err != nil {
				// 	log.Fatalf("Erreur lors du décodage du JSON : %v", err)
				// }

				var stateActionData map[string]interface{}
				var unescapedAction string
				err := json.Unmarshal(action.Action, &unescapedAction)
				if err != nil {
					log.Fatalf("Erreur lors du déséchappement du JSON : %v", err)
				}
				err = json.Unmarshal([]byte(unescapedAction), &stateActionData)
				if err != nil {
					log.Fatalf("Erreur lors du décodage du JSON  lib harry : %v", err)
				}

				var statex model.State

				// Vérifie si "book_id" existe
				if idBook, ok := stateActionData["id_book"]; ok {
					// Conversion de idBook en string
					idBook, ok := idBook.(string)
					if !ok {
						log.Fatalf("Erreur : id_book n'est pas une chaîne de caractères")
					}
					statex, err = repository.NewStateRepository(ss.DB).SelectStateByUserAndBook(action.IdUser, idBook)
					if err != nil {
						log.Fatalf("Erreur lors du recuperation du state existant%v", err)
					}

					if stateActionData["progression"] != nil {
						progression := stateActionData["progression"].(float64)
						statex.Progression = uint(progression)
					}
					if stateActionData["is_available"] != nil {
						statex.IsAvailable = stateActionData["is_available"].(bool)
					}
					if stateActionData["last_read_date"] != nil {
						statex.LastReadDate = stateActionData["last_read_date"].(string)
					}
					if stateActionData["read_count"] != nil {
						readCount := stateActionData["read_count"].(float64)
						statex.ReadCount = uint(readCount)
					}
					if stateActionData["rate"] != nil {
						rate := stateActionData["rate"].(float64)
						statex.Rate = uint(rate)
					}
					if stateActionData["comment"] != nil {
						statex.Comment = stateActionData["comment"].(string)
					}
					if stateActionData["state"] != nil {
						statex.State = stateActionData["state"].(string)
					}
				}
				if res := repository.NewStateRepository(ss.DB).UpdateState(statex.IdUser, statex.IdBook, statex, action.Date); !res {
					return fmt.Errorf("update failed for ID %s", action.IdAction)
				}
			case "DELETE":
				if res := repository.NewStateRepository(ss.DB).DeleteState(state.IdUser, state.IdBook, action.Date); !res {
					return fmt.Errorf("delete failed for ID %s", action.IdAction)
				}
			default:
				return fmt.Errorf("Unknown action's Type '%s' for ID %s", action.Type, action.IdAction)
			}
		default:
			return fmt.Errorf("Unknown action's Table name '%s' for ID %s", action.TableName, action.IdAction)
		}
	}

	return nil
}

var _ interfaces.SynchroServiceInterface = &SynchroService{}
