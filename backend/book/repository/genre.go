package repository

import (
	"database/sql"
	"log"

	"booktime/model"
    "booktime/repository/interfaces"
)

type GenreRepository struct {
	DB *sql.DB
}

func NewGenreRepository(db *sql.DB) *GenreRepository {
	return &GenreRepository{DB: db}
}

func (gr *GenreRepository) InsertGenre(post model.PostGenre) bool {
	stmt, err := gr.DB.Prepare("INSERT INTO genre (name) VALUES ($1)")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()
	_, err2 := stmt.Exec(post.Name)
	if err2 != nil {
		log.Println(err2)
		return false
	}
	return true
}

func (gr *GenreRepository) SelectGenre() []model.Genre {
	var result []model.Genre
	rows, err := gr.DB.Query("SELECT * FROM genre")
	if err != nil {
		log.Println(err)
		return nil
	}
	for rows.Next() {
		var (
			id   uint
			name string
		)
		err := rows.Scan(&id, &name)
		if err != nil {
			log.Println(err)
		} else {
			genre := model.Genre{IdGenre: id, Name: name}
			result = append(result, genre)
		}
	}
	return result
}
var _ interfaces.GenreRepositoryInterface = &GenreRepository{}
