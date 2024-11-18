package repository

import (
	"database/sql"
	"log"

	"book/model"
)

type BookAuthorRepository struct {
	DB *sql.DB
}

func NewBookAuthorRepository(db *sql.DB) *BookAuthorRepository {
	return &BookAuthorRepository{DB: db}
}

// InsertBookAuthor insère une relation entre un livre et un auteur
func (repo *BookAuthorRepository) InsertBookAuthor(post model.PostBookAuthor) bool {
	query := "INSERT INTO book_author (id_author, id_book) VALUES ($1, $2)"
	_, err := repo.DB.Exec(query, post.IdAuthor, post.IdBook)
	if err != nil {
		log.Println("Error inserting book author:", err)
		return false
	}
	return true
}

// SelectBookAuthors récupère toutes les relations entre livres et auteurs
func (repo *BookAuthorRepository) SelectBookAuthors() []model.BookAuthor {
	query := "SELECT id_author, id_book FROM book_author"
	rows, err := repo.DB.Query(query)
	if err != nil {
		log.Println("Error selecting book authors:", err)
		return nil
	}
	defer rows.Close()

	var bookAuthors []model.BookAuthor
	for rows.Next() {
		var bookAuthor model.BookAuthor
		if err := rows.Scan(&bookAuthor.IdAuthor, &bookAuthor.IdBook); err != nil {
			log.Println("Error scanning book author:", err)
			continue
		}
		bookAuthors = append(bookAuthors, bookAuthor)
	}
	return bookAuthors
}

// SelectBookAuthor récupère une relation spécifique entre un livre et un auteur
func (repo *BookAuthorRepository) SelectBookAuthor(idAuthor uint, idBook uint) (model.BookAuthor, error) {
	query := "SELECT id_author, id_book FROM book_author WHERE id_author = $1 AND id_book = $2"
	row := repo.DB.QueryRow(query, idAuthor, idBook)

	var bookAuthor model.BookAuthor
	err := row.Scan(&bookAuthor.IdAuthor, &bookAuthor.IdBook)
	if err != nil {
		if err == sql.ErrNoRows {
			return model.BookAuthor{}, nil
		}
		return model.BookAuthor{}, err
	}
	return bookAuthor, nil
}

// DeleteBookAuthor supprime une relation entre un livre et un auteur
func (repo *BookAuthorRepository) DeleteBookAuthor(idAuthor uint, idBook uint) bool {
	query := "DELETE FROM book_author WHERE id_author = $1 AND id_book = $2"
	_, err := repo.DB.Exec(query, idAuthor, idBook)
	if err != nil {
		log.Println("Error deleting book author:", err)
		return false
	}
	return true
}
