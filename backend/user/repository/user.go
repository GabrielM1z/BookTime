package repository

import (
	"database/sql"
	"encoding/json"
	"log"
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

func (br *UserRepository) InsertUser(user model.User) bool {
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

	return br.LogAction(user.IdUser, "USER_BOOKTIME", "INSERT", actionMap)
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

func (ur *UserRepository) DeleteUser(idUser uuid.UUID) bool {
	query := "DELETE FROM user_booktime WHERE id_user = $1"

	_, err := ur.DB.Exec(query, idUser)
	if err != nil {
		log.Println(err)
		return false
	}

	actionMap := map[string]interface{}{
		"id_user": idUser,
	}

	return ur.LogAction(idUser, "USER_BOOKTIME", "DELETE", actionMap)
}

func (ur *UserRepository) UpdateUser(user model.User) bool {
	query := `UPDATE user_booktime SET pseudo = $1, description = $2, private = $3, profil_image = $4, banner_image = $5, birthdate = $6 WHERE id_user = $7`

	_, err := ur.DB.Exec(query, user.Pseudo, user.Description, user.Private, user.ProfilImage, user.BannerImage, user.Birthday, user.IdUser)
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

	return ur.LogAction(user.IdUser, "USER_BOOKTIME", "UPDATE", actionMap)
}

func (ur *UserRepository) LogAction(idUser uuid.UUID, tableName, actionType string, actionData map[string]interface{}) bool {
	actionJSON, err := json.Marshal(actionData)
	if err != nil {
		log.Println("Erreur lors de l'encodage JSON:", err)
		return false
	}

	action := model.PostAction{
		IdUser:     idUser,
		Table:      tableName,
		Date:       time.Now(),
		Type:       actionType,
		Action:     actionJSON,
		ExecutedBy: "SERVER",
	}

	return NewActionRepository(ur.DB).InsertAction(action, idUser)
}

var _ interfaces.UserRepositoryInterface = &UserRepository{}
