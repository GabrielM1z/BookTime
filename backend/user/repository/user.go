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

// func (br *UserRepository) SelectUsers() []*model.User {
// 	query := `
//         SELECT id_user, private, profil_image, banner_image, birthdate
//         FROM user;`

// 	rows, err := br.DB.Query(query)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer rows.Close()

// 	users := []*model.User{}

// 	for rows.Next() {
// 		var user model.User
// 		if err := rows.Scan(&user.IdUser, &user.Private, &user.ProfilImage, &user.BannerImage, &user.Birthday); err != nil {
// 			log.Fatal(err)
// 		}
// 	}

// 	return users
// }

func (br *UserRepository) InsertUser(post model.PostUser) bool {
	_, err := br.DB.Exec("INSERT INTO userBooktime (private, profil_image, banner_image, birthdate) VALUES ($1, $2, $3, $4)",
		post.Private, post.ProfilImage, post.BannerImage, post.Birthday)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (br *UserRepository) SelectUser(id string) (*model.User, error) {
	query := `
        SELECT id_user, private, profil_image, banner_image, birthdate
        FROM userBooktime WHERE id_user = $1;`

	row := br.DB.QueryRow(query, id)

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
