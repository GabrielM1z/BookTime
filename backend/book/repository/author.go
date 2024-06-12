package repository

import (
	"database/sql"
	"log"

	"booktime/model"
    "booktime/repository/interfaces"
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

func (ar *AuthorRepository) SelectAuthor() []model.Author {
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

var _ interfaces.AuthorRepositoryInterface = &AuthorRepository{}