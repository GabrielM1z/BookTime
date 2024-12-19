package repository

import (
	"database/sql"
	"log"

	"user/model"

	"github.com/google/uuid"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (br *UserRepository) InsertUser(post model.PostUser) bool {
	_, err := br.DB.Exec("INSERT INTO userBooktime (private, profil_image, banner_image, birthdate) VALUES ($1, $2, $3, $4)",
		post.Private, post.ProfilImage, post.BannerImage, post.Birthday)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (ur *UserRepository) SelectUser(id uuid.UUID) (*model.User, error) {
	query := `
        SELECT id_user, private, profil_image, banner_image, birthdate
        FROM userBooktime WHERE id_user = $1;`

	row := ur.DB.QueryRow(query, id)

	var user model.User
	err := row.Scan(&user.IdUser, &user.Private, &user.ProfilImage, &user.BannerImage, &user.Birthday)
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
	var users []model.User
	rows, err := ur.DB.Query("SELECT * FROM userBooktime")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			id        uuid.UUID
			private   string
			profilImg string
			bannerImg string
			birthday  string
		)
		err := rows.Scan(&id, &private, &profilImg, &bannerImg, &birthday)
		if err != nil {
			log.Println(err)
		} else {
			user := model.User{IdUser: id, Private: private, ProfilImage: profilImg, BannerImage: bannerImg, Birthday: birthday}
			users = append(users, user)
		}
	}
	return users
}

func (ur *UserRepository) DeleteUser(id uuid.UUID) bool {
	query := "DELETE FROM userBooktime WHERE id_user = $1"

	_, err := ur.DB.Exec(query, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (ur *UserRepository) UpdateUser(user model.User) bool {
	query := `UPDATE userBooktime SET private = $1, profil_image = $2, banner_image = $3, birthdate = $4 WHERE id_user = $5`

	_, err := ur.DB.Exec(query, user.Private, user.ProfilImage, user.BannerImage, user.Birthday, user.IdUser)
	if err != nil {
		log.Println(err)
		return false
	}

	return true
}
