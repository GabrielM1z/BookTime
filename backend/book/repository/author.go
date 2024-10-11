package repository

import (
	"database/sql"
	"log"

	"book/model"
	"book/repository/interfaces"
)

type AuthorRepository struct {
	DB *sql.DB
}

func NewAuthorRepository(db *sql.DB) *AuthorRepository {
	return &AuthorRepository{DB: db}
}

func (ar *AuthorRepository) InsertAuthor(post model.PostAuthor) bool {
	_, err := ar.DB.Exec("INSERT INTO author (first_name, last_name, description) VALUES ($1, $2, $3)",
		post.FirstName, post.LastName, post.Description)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (ar *AuthorRepository) SelectAuthors() []model.Author {
	query := "SELECT * FROM author"
	rows, err := ar.DB.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	authors := []model.Author{}
	for rows.Next() {
		var author model.Author
		if err := rows.Scan(&author.IdAuthor, &author.FirstName, &author.LastName, &author.Description); err != nil {
			log.Fatal(err)
		}
		authors = append(authors, author)
	}
	return authors
}

func (ar *AuthorRepository) SelectAuthor(id int) (*model.Author, error) {
	query := "SELECT id_author, first_name, last_name, description FROM author WHERE id_author = $1"
	row := ar.DB.QueryRow(query, id)

	var author model.Author
	err := row.Scan(&author.IdAuthor, &author.FirstName, &author.LastName, &author.Description)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		log.Println(err)
		return nil, err
	}

	return &author, nil
}

func (ar *AuthorRepository) UpdateAuthor(id int, author model.Author) bool {
	stmt, err := ar.DB.Prepare("UPDATE author SET first_name = $1, last_name = $2, description = $3 WHERE id_author = $4")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()

	_, err = stmt.Exec(author.FirstName, author.LastName, author.Description, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (ar *AuthorRepository) DeleteAuthor(id int) bool {
	stmt, err := ar.DB.Prepare("DELETE FROM author WHERE id_author = $1")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()

	_, err = stmt.Exec(id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

var _ interfaces.AuthorRepositoryInterface = &AuthorRepository{}
