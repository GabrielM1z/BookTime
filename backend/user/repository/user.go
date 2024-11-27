package repository

import (
	"database/sql"
	"log"

	"user/model"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (ur *UserRepository) InsertUser(post model.PostUser) bool {
	_, err := ur.DB.Exec("INSERT INTO user (id_keycloak, user_name, first_name, last_name, email, birthdate, private) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		post.IdKeycloak, post.UserName, post.FirstName, post.LastName, post.Email, post.Birthdate, post.Private)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (ur *UserRepository) SelectUser(id int) (*model.User, error) {
	query := `
        SELECT id_user, id_keycloak, user_name, first_name, last_name, email,
               TO_CHAR( birthdate,'YYYY-MM-DD') as  birthdate,
			   private
        FROM user WHERE id_user = $1`

	row := ur.DB.QueryRow(query, id)

	var user model.User
	err := row.Scan(&user.IdUser, &user.IdKeycloak, &user.UserName, &user.FirstName, &user.LastName, &user.Email, &user.Birthdate, &user.Private)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		log.Println(err)
		return nil, err
	}

	return &user, nil
}

func (ur *UserRepository) UpdateUser(id int, user model.User) bool {
	query := `UPDATE user SET user_name = $1, first_name = $2, last_name = $3, email = $4, birthdate = $5 , private = $6
	WHERE id_user = $7`

	_, err := ur.DB.Exec(query, user.UserName, user.FirstName, user.LastName, user.Email, user.Birthdate, user.Private, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (ur *UserRepository) DeleteUser(id int) bool {
	query := "DELETE FROM user WHERE id_user = $1"

	_, err := ur.DB.Exec(query, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}
