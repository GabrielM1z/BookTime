package repository

import (
	"database/sql"
	"log"

	"book/model"
)

type BookGenreRepository struct {
	DB *sql.DB
}

func NewBookGenreRepository(db *sql.DB) *BookGenreRepository {
	return &BookGenreRepository{DB: db}
}

// InsertBookGenre insère une relation entre un livre et un genre
func (repo *BookGenreRepository) InsertBookGenre(post model.PostBookGenre) bool {
	query := "INSERT INTO book_genre (id_genre, id_book) VALUES ($1, $2)"
	_, err := repo.DB.Exec(query, post.IdGenre, post.IdBook)
	if err != nil {
		log.Println("Error inserting book genre:", err)
		return false
	}
	return true
}

// SelectBookGenres récupère toutes les relations entre livres et genres
func (repo *BookGenreRepository) SelectBookGenres() []model.BookGenre {
	query := "SELECT id_genre, id_book FROM book_genre"
	rows, err := repo.DB.Query(query)
	if err != nil {
		log.Println("Error selecting book genres:", err)
		return nil
	}
	defer rows.Close()

	var bookGenres []model.BookGenre
	for rows.Next() {
		var bookGenre model.BookGenre
		if err := rows.Scan(&bookGenre.IdGenre, &bookGenre.IdBook); err != nil {
			log.Println("Error scanning book genre:", err)
			continue
		}
		bookGenres = append(bookGenres, bookGenre)
	}
	return bookGenres
}

// SelectBookGenre récupère une relation spécifique entre un livre et un genre
func (repo *BookGenreRepository) SelectBookGenre(idGenre uint, idBook uint) (model.BookGenre, error) {
	query := "SELECT id_genre, id_book FROM book_genre WHERE id_genre = $1 AND id_book = $2"
	row := repo.DB.QueryRow(query, idGenre, idBook)

	var bookGenre model.BookGenre
	err := row.Scan(&bookGenre.IdGenre, &bookGenre.IdBook)
	if err != nil {
		if err == sql.ErrNoRows {
			return model.BookGenre{}, nil
		}
		return model.BookGenre{}, err
	}
	return bookGenre, nil
}

// DeleteBookGenre supprime une relation entre un livre et un genre
func (repo *BookGenreRepository) DeleteBookGenre(idGenre uint, idBook uint) bool {
	query := "DELETE FROM book_genre WHERE id_genre = $1 AND id_book = $2"
	_, err := repo.DB.Exec(query, idGenre, idBook)
	if err != nil {
		log.Println("Error deleting book genre:", err)
		return false
	}
	return true
}
