package repository

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"time"

	"user/model"
	"user/repository/interfaces"

	"github.com/google/uuid"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (br *UserRepository) InsertUser(user model.User, actionDate ...time.Time) bool {
	_, err := br.DB.Exec("INSERT INTO user_booktime (id_user, pseudo, description, private, profil_image, banner_image, birthdate) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		user.IdUser, user.Pseudo, user.Description, user.Private, user.ProfilImage, user.BannerImage, user.Birthday)
	if err != nil {
		log.Println(err)
		return false
	}

	actionMap := map[string]interface{}{
		"id_user":      user.IdUser,
		"pseudo":       user.Pseudo,
		"description":  user.Description,
		"private":      user.Private,
		"profil_image": user.ProfilImage,
		"banner_image": user.BannerImage,
		"birthdate":    user.Birthday,
	}

	return br.LogAction(user.IdUser, "USER_BOOKTIME", "INSERT", actionMap, actionDate...)
}

func (ur *UserRepository) SelectUser(id uuid.UUID) (*model.User, error) {
	query := `
        SELECT id_user, pseudo, description, private, profil_image, banner_image, birthdate
        FROM user_booktime WHERE id_user = $1;`

	row := ur.DB.QueryRow(query, id)

	var user model.User
	err := row.Scan(&user.IdUser, &user.Pseudo, &user.Description, &user.Private, &user.ProfilImage, &user.BannerImage, &user.Birthday)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		log.Println(err)
		return nil, err
	}

	return &user, nil
}

func (ur *UserRepository) SelectUsers() []model.User {
	query := "SELECT * FROM user_booktime"
	rows, err := ur.DB.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	users := []model.User{}
	for rows.Next() {
		var user model.User
		if err := rows.Scan(&user.IdUser, &user.Pseudo, &user.Description, &user.Private, &user.ProfilImage, &user.BannerImage, &user.Birthday); err != nil {
			log.Fatal(err)
		}
		users = append(users, user)
	}
	return users
}

func (ur *UserRepository) DeleteUser(idUser uuid.UUID, actionDate ...time.Time) bool {
	query := "DELETE FROM user_booktime WHERE id_user = $1"

	_, err := ur.DB.Exec(query, idUser)
	if err != nil {
		log.Println(err)
		return false
	}

	actionMap := map[string]interface{}{
		"id_user": idUser,
	}

	return ur.LogAction(idUser, "USER_BOOKTIME", "DELETE", actionMap, actionDate...)
}

func (ur *UserRepository) UpdateUser(user model.User, actionDate ...time.Time) bool {
	baseUser, err := ur.SelectUser(user.IdUser)
	if err != nil {
		log.Println(err)
		return false
	}

	query := `UPDATE user_booktime SET `
	params := []interface{}{}
	counter := 1 // Compteur des paramètres sql ($1, $2, etc.)

	if user.Pseudo != "" || user.Description != "" || user.Private != false || user.ProfilImage != "" || user.BannerImage != "" || user.Birthday != "" {
		actionMap := map[string]interface{}{}

		if user.Pseudo != "" && user.Pseudo != baseUser.Pseudo {
			query += "pseudo = $" + fmt.Sprint(counter) + ", "
			params = append(params, user.Pseudo)
			counter++
			actionMap["pseudo"] = user.Pseudo
		}
		if user.Description != "" && user.Description != baseUser.Description {
			query += "description = $" + fmt.Sprint(counter) + ", "
			params = append(params, user.Description)
			counter++
			actionMap["description"] = user.Description
		}
		if user.Private != baseUser.Private {
			query += "private = $" + fmt.Sprint(counter) + ", "
			params = append(params, user.Private)
			counter++
			actionMap["private"] = user.Private
		}
		if user.ProfilImage != "" && user.ProfilImage != baseUser.ProfilImage {
			query += "profil_image = $" + fmt.Sprint(counter) + ", "
			params = append(params, user.ProfilImage)
			counter++
			actionMap["profil_image"] = user.ProfilImage
		}
		if user.BannerImage != "" && user.BannerImage != baseUser.BannerImage {
			query += "banner_image = $" + fmt.Sprint(counter) + ", "
			params = append(params, user.BannerImage)
			counter++
			actionMap["banner_image"] = user.BannerImage
		}
		if user.Birthday != "" && user.Birthday != baseUser.Birthday {
			query += "birthdate = $" + fmt.Sprint(counter) + ", "
			params = append(params, user.Birthday)
			counter++
			actionMap["birthdate"] = user.Birthday
		}

		query = query[:len(query)-2] // Suppression de la dernière virgule
		query += " WHERE id_user = $" + fmt.Sprint(counter)

		params = append(params, user.IdUser)

		_, err := ur.DB.Exec(query, params...)
		if err != nil {
			log.Println(err)
			return false
		}

		actionMap["id_user"] = user.IdUser.String()

		return ur.LogAction(user.IdUser, "USER_BOOKTIME", "UPDATE", actionMap, actionDate...)
	}
	return false
}

func (ur *UserRepository) LogAction(idUser uuid.UUID, tableName, actionType string, actionData map[string]interface{}, actionDate ...time.Time) bool {
	actionJSON, err := json.Marshal(actionData)
	if err != nil {
		log.Println("Erreur lors de l'encodage JSON:", err)
		return false
	}

	var date time.Time
	if len(actionDate) > 0 {
		date = actionDate[0]
	} else {
		date = time.Now()
	}

	action := model.PostAction{
		IdUser:     idUser,
		TableName:  tableName,
		Date:       date,
		Type:       actionType,
		Action:     []byte(strconv.Quote(string(actionJSON))),
		ExecutedBy: "SERVER",
	}

	return NewActionRepository(ur.DB).InsertAction(action, idUser)
}

var _ interfaces.UserRepositoryInterface = &UserRepository{}
