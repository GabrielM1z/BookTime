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

func (bgr *BookGenreRepository) InsertBookGenre(post model.PostBookGenre) bool {
	_, err := bgr.DB.Exec("INSERT INTO book_genre (id_genre, id_book) VALUES ($1, $2)",
		post.IdGenre, post.IdBook)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (bgr *BookGenreRepository) SelectBookGenres() []*model.BookGenre {
	rows, err := bgr.DB.Query("SELECT id_genre, id_book FROM book_genre")
	if err != nil {
		log.Println(err)
		return nil
	}
	defer rows.Close()

	var genres []*model.BookGenre
	for rows.Next() {
		var genre model.BookGenre
		if err := rows.Scan(&genre.IdGenre, &genre.IdBook); err != nil {
			log.Println(err)
			continue
		}
		genres = append(genres, &genre)
	}

	return genres
}
