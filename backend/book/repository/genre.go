package repository

import (
	"database/sql"
	"log"

	"book/model"
	"book/repository/interfaces"
)

type GenreRepository struct {
	DB *sql.DB
}

func NewGenreRepository(db *sql.DB) *GenreRepository {
	return &GenreRepository{DB: db}
}

// func (gr *GenreRepository) InsertGenre(post model.PostGenre) bool {
// 	stmt, err := gr.DB.Prepare("INSERT INTO genre (name) VALUES ($1)")
// 	if err != nil {
// 		log.Println(err)
// 		return false
// 	}
// 	defer stmt.Close()
// 	_, err2 := stmt.Exec(post.Name)
// 	if err2 != nil {
// 		log.Println(err2)
// 		return false
// 	}
// 	return true
// }

// func (gr *GenreRepository) SelectGenre() []model.Genre {
// 	var result []model.Genre
// 	rows, err := gr.DB.Query("SELECT * FROM genre")
// 	if err != nil {
// 		log.Println(err)
// 		return nil
// 	}
// 	for rows.Next() {
// 		var (
// 			id   uint
// 			name string
// 		)
// 		err := rows.Scan(&id, &name)
// 		if err != nil {
// 			log.Println(err)
// 		} else {
// 			genre := model.Genre{IdGenre: id, Name: name}
// 			result = append(result, genre)
// 		}
// 	}
// 	return result
// }

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

func (gr *GenreRepository) SelectGenres() []model.Genre {
	var result []model.Genre
	rows, err := gr.DB.Query("SELECT * FROM genre")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

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

func (gr *GenreRepository) SelectGenre(id uint) (model.Genre, error) {
	var genre model.Genre
	stmt, err := gr.DB.Prepare("SELECT * FROM genre WHERE id_genre = $1")
	if err != nil {
		log.Println(err)
		return genre, err
	}
	defer stmt.Close()

	row := stmt.QueryRow(id)
	err = row.Scan(&genre.IdGenre, &genre.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			return genre, nil // Pas de genre trouvé
		}
		log.Println(err)
		return genre, err // Erreur de lecture
	}

	return genre, nil
}

func (gr *GenreRepository) UpdateGenre(id int, genre model.Genre) bool {
	query := `UPDATE genre SET name = $1 WHERE id_genre = $2`

	_, err := gr.DB.Exec(query, genre.Name, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (gr *GenreRepository) DeleteGenre(id int) bool {
	query := "DELETE FROM genre WHERE id_genre = $1"

	_, err := gr.DB.Exec(query, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

var _ interfaces.GenreRepositoryInterface = &GenreRepository{}
