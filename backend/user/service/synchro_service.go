package service

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"slices"
	"sort"
	"time"
	"user/model"
	"user/repository"

	"user/service/interfaces"

	"github.com/google/uuid"
)

type SynchroService struct {
	DB *sql.DB
}

func NewSynchroService(db *sql.DB) *SynchroService {
	return &SynchroService{DB: db}
}

type userPseudoActionInfo struct {
	ActionId uuid.UUID
	Pseudo   string
	Date     time.Time
}

type userDescriptionActionInfo struct {
	ActionId    uuid.UUID
	Description string
	Date        time.Time
}

type userPrivateActionInfo struct {
	ActionId uuid.UUID
	Private  bool
	Date     time.Time
}

type userProfilImageActionInfo struct {
	ActionId    uuid.UUID
	ProfilImage string
	Date        time.Time
}

type userBannerImageActionInfo struct {
	ActionId    uuid.UUID
	BannerImage string
	Date        time.Time
}

type userBirthdayActionInfo struct {
	ActionId uuid.UUID
	Birthday string
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

func (ss *SynchroService) whoDoWhichActions(filteredActions []model.Action) ([]model.Action, []model.Action, error) {
	clientActions := []model.Action{}
	serverActions := []model.Action{}

	fmt.Println("clientActions111", clientActions)

	// var updateUserActions []model.Action
	updateUserActions := make(map[uuid.UUID]model.Action)

	// var updateLibraryActions []model.Action
	var insertActions []model.Action
	var deleteActions []model.Action
	var deletedUsers []string

	//On met chaque action dans une liste qui regroupe toutes les actions de meme type UPDATE INSERT DELETE
	for _, action := range filteredActions {
		if action.Table == "USER_BOOKTIME" {
			if action.Type == "UPDATE" {
				updateUserActions[action.IdAction] = action
			} else if action.Type == "INSERT" {
				insertActions = append(insertActions, action)
			} else if action.Type == "DELETE" {
				deleteActions = append(deleteActions, action)
			}
		}
	}

	// --== DELETE ==--

	// On initialise des maps pour détecter les doublons.
	deletedUsersMap := make(map[uuid.UUID]bool)

	// On initialise des listes temporaires pour filtrer les actions.
	var filteredServerActions, filteredClientActions []model.Action

	// On met chaque action DELETE dans une liste des actions à exécuter pour le CLIENT ou SERVER
	for _, action := range deleteActions {
		var isDuplicate bool // Indicateur de doublon

		if action.Table == "USER_BOOKTIME" {
			var user model.User
			err := json.Unmarshal(action.Action, &user)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON : %v", err)
			}

			deletedUsers = append(deletedUsers, user.IdUser.String())

			if deletedUsersMap[user.IdUser] {
				isDuplicate = true // Doublon détecté
			} else {
				deletedUsersMap[user.IdUser] = true
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
	fmt.Println("clientActions222", clientActions)

	// --== INSERT ==--

	//On met chaque action INSERT dans une liste des actions a executer pour le CLIENT ou SERVER si l'objet n'est pas dans la liste des objets supprimes
	for _, action := range insertActions {
		if action.Table == "USER_BOOKTIME" {
			var user model.User
			err := json.Unmarshal(action.Action, &user)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON : %v", err)
			} else if !contains(deletedUsers, user.IdUser.String()) {
				if action.ExecutedBy == "CLIENT" {
					serverActions = append(serverActions, action)
				} else if action.ExecutedBy == "SERVER" {
					clientActions = append(clientActions, action)
					fmt.Println("clientActions333", clientActions)
				}
			}
		}
	}
	fmt.Println("clientActions444", clientActions)

	// --== UPDATE ==--

	//USER
	usersPseudoActionsInfos := make(map[string]userPseudoActionInfo)
	usersDescriptionActionInfo := make(map[string]userDescriptionActionInfo)
	usersPrivateActionInfo := make(map[string]userPrivateActionInfo)
	usersProfilImageActionInfo := make(map[string]userProfilImageActionInfo)
	usersBannerImageActionInfo := make(map[string]userBannerImageActionInfo)
	usersBirthdayActionInfo := make(map[string]userBirthdayActionInfo)


	var actionList []model.Action
	for _, action := range updateUserActions {
		actionList = append(actionList, action)
	}

	sort.Slice(actionList, func(i, j int) bool {
		return actionList[i].Date.After(actionList[j].Date)
	})
	// Parcourir les actions dans l'ordre chronologique inverse
	for _, action := range actionList {
		var userActionData map[string]interface{}
		err := json.Unmarshal(action.Action, &userActionData)
		if err != nil {
			log.Fatalf("Erreur lors du décodage du JSON : %v", err)
		}

		// Vérifie si "id_user" existe
		if idUser, ok := userActionData["id_user"]; ok {
			idUser, ok := idUser.(string)
			if !ok {
				log.Fatalf("Erreur : id_user n'est pas une chaîne de caractères")
			}
			if !contains(deletedUsers, idUser) {

				// Vérifie et met à jour les différentes propriétés de l'utilisateur
				if pseudo, ok := userActionData["pseudo"]; ok {
					pseudoStr, ok := pseudo.(string)
					if !ok {
						log.Fatalf("Erreur : pseudo n'est pas une chaîne valide")
					}
					if _, exists := usersPseudoActionsInfos[idUser]; !exists {
						usersPseudoActionsInfos[idUser] = userPseudoActionInfo{
							ActionId: action.IdAction,
							Pseudo:   pseudoStr,
							Date:     action.Date,
						}
					}
				}

				if description, ok := userActionData["description"]; ok {
					descriptionStr, ok := description.(string)
					if !ok {
						log.Fatalf("Erreur : description n'est pas une chaîne valide")
					}
					if _, exists := usersDescriptionActionInfo[idUser]; !exists {
						usersDescriptionActionInfo[idUser] = userDescriptionActionInfo{
							ActionId:    action.IdAction,
							Description: descriptionStr,
							Date:        action.Date,
						}
					}
				}

				if private, ok := userActionData["private"]; ok {
					privateBool, ok := private.(bool)
					if !ok {
						log.Fatalf("Erreur : private n'est pas un booléen")
					}
					if _, exists := usersPrivateActionInfo[idUser]; !exists {
						usersPrivateActionInfo[idUser] = userPrivateActionInfo{
							ActionId: action.IdAction,
							Private:  privateBool,
							Date:     action.Date,
						}
					}
				}

				if profilImage, ok := userActionData["profil_image"]; ok {
					profilImageStr, ok := profilImage.(string)
					if !ok {
						log.Fatalf("Erreur : profil_image n'est pas une chaîne valide")
					}
					if _, exists := usersProfilImageActionInfo[idUser]; !exists {
						usersProfilImageActionInfo[idUser] = userProfilImageActionInfo{
							ActionId:    action.IdAction,
							ProfilImage: profilImageStr,
							Date:        action.Date,
						}
					}
				}

				if bannerImage, ok := userActionData["banner_image"]; ok {
					bannerImageStr, ok := bannerImage.(string)
					if !ok {
						log.Fatalf("Erreur : banner_image n'est pas une chaîne valide")
					}
					if _, exists := usersBannerImageActionInfo[idUser]; !exists {
						usersBannerImageActionInfo[idUser] = userBannerImageActionInfo{
							ActionId:    action.IdAction,
							BannerImage: bannerImageStr,
							Date:        action.Date,
						}
					}
				}

				if birthday, ok := userActionData["birthday"]; ok {
					birthdayStr, ok := birthday.(string)
					if !ok {
						log.Fatalf("Erreur : birthday n'est pas une chaîne valide")
					}
					if _, exists := usersBirthdayActionInfo[idUser]; !exists {
						usersBirthdayActionInfo[idUser] = userBirthdayActionInfo{
							ActionId: action.IdAction,
							Birthday: birthdayStr,
							Date:     action.Date,
						}
					}
				}
			}
		}
	}

	// Ajout des actions à exécuter sans doublons
	uniqueActions := make(map[uuid.UUID]model.Action)

	for _, action := range usersPseudoActionsInfos {
		uniqueActions[action.ActionId] = updateUserActions[action.ActionId]
	}

	for _, action := range usersDescriptionActionInfo {
		uniqueActions[action.ActionId] = updateUserActions[action.ActionId]
	}

	for _, action := range usersPrivateActionInfo {
		uniqueActions[action.ActionId] = updateUserActions[action.ActionId]
	}

	for _, action := range usersProfilImageActionInfo {
		uniqueActions[action.ActionId] = updateUserActions[action.ActionId]
	}

	for _, action := range usersBannerImageActionInfo {
		uniqueActions[action.ActionId] = updateUserActions[action.ActionId]
	}

	for _, action := range usersBirthdayActionInfo {
		uniqueActions[action.ActionId] = updateUserActions[action.ActionId]
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

	fmt.Println("SynchroService.Synchro() called")
	server_actions := repository.NewActionRepository(ss.DB).SelectActionsFromDate(uuidUser, lastSyncDate)

	fmt.Println("server_actions", server_actions)

	mixed_actions := slices.Concat(server_actions, client_actions)

	fmt.Println("mixed_actions", mixed_actions)

	server_actions_to_exec, client_actions_to_exec, err := ss.whoDoWhichActions(mixed_actions)

	fmt.Println("server_actions_to_exec", server_actions_to_exec)

	ss.executeActionsToSynchronizeServer(server_actions_to_exec)

	fmt.Println("client_actions_to_exec", client_actions_to_exec)

	return client_actions_to_exec, err
}

func (ss *SynchroService) executeActionsToSynchronizeServer(clientActionsToExecute []model.Action) error {

	// Trier les actions par ordre chronologique
	sort.Slice(clientActionsToExecute, func(i, j int) bool {
		return clientActionsToExecute[i].Date.Before(clientActionsToExecute[j].Date)
	})

	for _, action := range clientActionsToExecute {
		switch action.Table {
		case "USER_BOOKTIME":
			var user model.User
			err := json.Unmarshal(action.Action, &user)

			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON : %v", err)
			}

			switch action.Type {
			case "INSERT":
				if res := repository.NewUserRepository(ss.DB).InsertUser(user, action.Date); !res {
					return fmt.Errorf("insert failed for ID %s", action.IdAction)
				}
			case "UPDATE":
				if res := repository.NewUserRepository(ss.DB).UpdateUser(user, action.Date); !res {
					return fmt.Errorf("update failed for ID %s", action.IdAction)
				}
			case "DELETE":
				if res := repository.NewUserRepository(ss.DB).DeleteUser(user.IdUser, action.Date); !res {
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
