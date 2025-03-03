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

	// var updateUserActions []model.Action
	updateUserActions := make(map[uuid.UUID]model.Action)

	// var updateLibraryActions []model.Action
	var insertActions []model.Action
	var deleteActions []model.Action
	var deletedUsers []uuid.UUID

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

			deletedUsers = append(deletedUsers, user.IdUser)

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

	// --== INSERT ==--

	//On met chaque action INSERT dans une liste des actions a executer pour le CLIENT ou SERVER si l'objet n'est pas dans la liste des objets supprimes
	for _, action := range insertActions {
		if action.Table == "USER_BOOKTIME" {
			var user model.User
			err := json.Unmarshal(action.Action, &user)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON : %v", err)
			} else if !contains(deletedUsers, user.IdUser) {
				if action.ExecutedBy == "CLIENT" {
					serverActions = append(serverActions, action)
				} else if action.ExecutedBy == "SERVER" {
					clientActions = append(clientActions, action)
				}
			}
		}
	}

	// --== UPDATE ==--

	//USER
	usersPseudoActionsInfos := make(map[uuid.UUID]userPseudoActionInfo)
	usersDescriptionActionInfo := make(map[uuid.UUID]userDescriptionActionInfo)
	usersPrivateActionInfo := make(map[uuid.UUID]userPrivateActionInfo)
	usersProfilImageActionInfo := make(map[uuid.UUID]userProfilImageActionInfo)
	usersBannerImageActionInfo := make(map[uuid.UUID]userBannerImageActionInfo)
	usersBirthdayActionInfo := make(map[uuid.UUID]userBirthdayActionInfo)

	for _, action := range updateUserActions {
		var userActionData map[string]interface{}
		err := json.Unmarshal(action.Action, &userActionData)
		if err != nil {
			log.Fatalf("Erreur lors du décodage du JSON : %v", err)
		}

		// Vérifie si "id_user" existe
		if idUser, ok := userActionData["id_user"]; ok {

			fmt.Println("idUser", idUser)
			if !contains(deletedUsers, idUser.(uuid.UUID)) {

				// Vérifie si "pseudo" existe
				if pseudo, ok := userActionData["pseudo"]; ok {
					pseudoStr, ok := pseudo.(string)
					if !ok {
						log.Fatalf("Erreur : pseudo n'est pas une chaîne valide")
					}

					if _, exists := usersPseudoActionsInfos[idUser.(uuid.UUID)]; exists {
						if action.Date.After(usersPseudoActionsInfos[idUser.(uuid.UUID)].Date) {
							usersPseudoActionsInfos[idUser.(uuid.UUID)] = userPseudoActionInfo{
								ActionId: action.IdAction,
								Pseudo:   pseudoStr,
								Date:     action.Date,
							}
						}
					} else {
						usersPseudoActionsInfos[idUser.(uuid.UUID)] = userPseudoActionInfo{
							ActionId: action.IdAction,
							Pseudo:   pseudoStr,
							Date:     action.Date,
						}
					}
				}

				// Vérifie si "description" existe
				if description, ok := userActionData["description"]; ok {
					descriptionStr, ok := description.(string)
					if !ok {
						log.Fatalf("Erreur : description n'est pas une chaîne valide")
					}

					if _, exists := usersDescriptionActionInfo[idUser.(uuid.UUID)]; exists {
						if action.Date.After(usersDescriptionActionInfo[idUser.(uuid.UUID)].Date) {
							usersDescriptionActionInfo[idUser.(uuid.UUID)] = userDescriptionActionInfo{
								ActionId:    action.IdAction,
								Description: descriptionStr,
								Date:        action.Date,
							}
						}
					} else {
						usersDescriptionActionInfo[idUser.(uuid.UUID)] = userDescriptionActionInfo{
							ActionId:    action.IdAction,
							Description: descriptionStr,
							Date:        action.Date,
						}
					}
				}

				// Vérifie si "private" existe
				if private, ok := userActionData["private"]; ok {
					privateBool, ok := private.(bool)
					if !ok {
						log.Fatalf("Erreur : private n'est pas un booléen")
					}

					if _, exists := usersPrivateActionInfo[idUser.(uuid.UUID)]; exists {
						if action.Date.After(usersPrivateActionInfo[idUser.(uuid.UUID)].Date) {
							usersPrivateActionInfo[idUser.(uuid.UUID)] = userPrivateActionInfo{
								ActionId: action.IdAction,
								Private:  privateBool,
								Date:     action.Date,
							}
						}
					} else {
						usersPrivateActionInfo[idUser.(uuid.UUID)] = userPrivateActionInfo{
							ActionId: action.IdAction,
							Private:  privateBool,
							Date:     action.Date,
						}
					}
				}

				// Vérifie si "profil_image" existe
				if profilImage, ok := userActionData["profil_image"]; ok {
					profilImageStr, ok := profilImage.(string)
					if !ok {
						log.Fatalf("Erreur : profil_image n'est pas une chaîne valide")
					}

					if _, exists := usersProfilImageActionInfo[idUser.(uuid.UUID)]; exists {
						if action.Date.After(usersProfilImageActionInfo[idUser.(uuid.UUID)].Date) {
							usersProfilImageActionInfo[idUser.(uuid.UUID)] = userProfilImageActionInfo{
								ActionId:    action.IdAction,
								ProfilImage: profilImageStr,
								Date:        action.Date,
							}
						}
					} else {
						usersProfilImageActionInfo[idUser.(uuid.UUID)] = userProfilImageActionInfo{
							ActionId:    action.IdAction,
							ProfilImage: profilImageStr,
							Date:        action.Date,
						}
					}
				}

				// Vérifie si "banner_image" existe
				if bannerImage, ok := userActionData["banner_image"]; ok {
					bannerImageStr, ok := bannerImage.(string)
					if !ok {
						log.Fatalf("Erreur : banner_image n'est pas une chaîne valide")
					}

					if _, exists := usersBannerImageActionInfo[idUser.(uuid.UUID)]; exists {
						if action.Date.After(usersBannerImageActionInfo[idUser.(uuid.UUID)].Date) {
							usersBannerImageActionInfo[idUser.(uuid.UUID)] = userBannerImageActionInfo{
								ActionId:    action.IdAction,
								BannerImage: bannerImageStr,
								Date:        action.Date,
							}
						}
					} else {
						usersBannerImageActionInfo[idUser.(uuid.UUID)] = userBannerImageActionInfo{
							ActionId:    action.IdAction,
							BannerImage: bannerImageStr,
							Date:        action.Date,
						}
					}
				}

				// Vérifie si "birthday" existe
				if birthday, ok := userActionData["birthday"]; ok {
					birthdayStr, ok := birthday.(string)
					if !ok {
						log.Fatalf("Erreur : birthday n'est pas une chaîne valide")
					}

					if _, exists := usersBirthdayActionInfo[idUser.(uuid.UUID)]; exists {
						if action.Date.After(usersBirthdayActionInfo[idUser.(uuid.UUID)].Date) {
							usersBirthdayActionInfo[idUser.(uuid.UUID)] = userBirthdayActionInfo{
								ActionId: action.IdAction,
								Birthday: birthdayStr,
								Date:     action.Date,
							}
						}
					} else {
						usersBirthdayActionInfo[idUser.(uuid.UUID)] = userBirthdayActionInfo{
							ActionId: action.IdAction,
							Birthday: birthdayStr,
							Date:     action.Date,
						}
					}
				}
			}
		}
	}

	for _, action := range usersPseudoActionsInfos {
		actionToAdd := updateUserActions[action.ActionId]
		if actionToAdd.ExecutedBy == "CLIENT" {
			serverActions = append(serverActions, actionToAdd)
		} else if actionToAdd.ExecutedBy == "SERVER" {
			clientActions = append(clientActions, actionToAdd)
		}
	}

	for _, action := range usersDescriptionActionInfo {
		actionToAdd := updateUserActions[action.ActionId]
		if actionToAdd.ExecutedBy == "CLIENT" {
			serverActions = append(serverActions, actionToAdd)
		} else if actionToAdd.ExecutedBy == "SERVER" {
			clientActions = append(clientActions, actionToAdd)
		}
	}

	for _, action := range usersPrivateActionInfo {
		actionToAdd := updateUserActions[action.ActionId]
		if actionToAdd.ExecutedBy == "CLIENT" {
			serverActions = append(serverActions, actionToAdd)
		} else if actionToAdd.ExecutedBy == "SERVER" {
			clientActions = append(clientActions, actionToAdd)
		}
	}

	for _, action := range usersProfilImageActionInfo {
		actionToAdd := updateUserActions[action.ActionId]
		if actionToAdd.ExecutedBy == "CLIENT" {
			serverActions = append(serverActions, actionToAdd)
		} else if actionToAdd.ExecutedBy == "SERVER" {
			clientActions = append(clientActions, actionToAdd)
		}
	}

	for _, action := range usersBannerImageActionInfo {
		actionToAdd := updateUserActions[action.ActionId]
		if actionToAdd.ExecutedBy == "CLIENT" {
			serverActions = append(serverActions, actionToAdd)
		} else if actionToAdd.ExecutedBy == "SERVER" {
			clientActions = append(clientActions, actionToAdd)
		}
	}

	for _, action := range usersBirthdayActionInfo {
		actionToAdd := updateUserActions[action.ActionId]
		if actionToAdd.ExecutedBy == "CLIENT" {
			serverActions = append(serverActions, actionToAdd)
		} else if actionToAdd.ExecutedBy == "SERVER" {
			clientActions = append(clientActions, actionToAdd)
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
				if res := repository.NewUserRepository(ss.DB).InsertUser(user); !res {
					return fmt.Errorf("insert failed for ID %s", action.IdAction)
				}
			case "UPDATE":
				if res := repository.NewUserRepository(ss.DB).UpdateUser(user); !res {
					return fmt.Errorf("update failed for ID %s", action.IdAction)
				}
			case "DELETE":
				if res := repository.NewUserRepository(ss.DB).DeleteUser(user.IdUser); !res {
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
