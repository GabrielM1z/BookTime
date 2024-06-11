package repository

import (
	"database/sql"
	"log"

	"booktime/model"
)

type AuthorRepository struct {
	DB *sql.DB
}

func NewAuthorRepository(db *sql.DB) AuthorRepositoryInterface {
	return &AuthorRepository{DB: db}
}

func (ar *AuthorRepository) InsertAuthor(post model.PostAuthor) bool {
	stmt, err := ar.DB.Prepare("INSERT INTO author (first_name, last_name, description) VALUES ($1, $2, $3)")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()
	_, err2 := stmt.Exec(post.FirstName, post.LastName, post.Description)
	if err2 != nil {
		log.Println(err2)
		return false
	}
	return true
}

func (ar *AuthorRepository) SelectAuthor() []model.Author {
	var result []model.Author
	rows, err := ar.DB.Query("SELECT * FROM author")
	if err != nil {
		log.Println(err)
		return nil
	}
	for rows.Next() {
		var (
			id          uint
			firstName   string
			lastName    string
			description string
		)
		err := rows.Scan(&id, &firstName, &lastName, &description)
		if err != nil {
			log.Println(err)
		} else {
			author := model.Author{IdAuthor: id, FirstName: firstName, LastName: lastName, Description: description}
			result = append(result, author)
		}
	}
	return result
}
