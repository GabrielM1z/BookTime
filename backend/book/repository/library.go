package repository

import (
	"database/sql"
	"log"

	"booktime/model"
    "booktime/repository/interfaces"
)

type LibraryRepository struct {
	DB *sql.DB
}

func NewLibraryRepository(db *sql.DB) *LibraryRepository {
	return &LibraryRepository{DB: db}
}

func (lr *LibraryRepository) InsertLibrary(post model.PostLibrary) bool {
	stmt, err := lr.DB.Prepare("INSERT INTO library (name) VALUES ($1)")
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

func (lr *LibraryRepository) SelectLibrary() []model.Library {
	var result []model.Library
	rows, err := lr.DB.Query("SELECT * FROM library")
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
			library := model.Library{IdLibrary: id, Name: name}
			result = append(result, library)
		}
	}
	return result
}



func (lr *LibraryRepository) SelectLibraryByUser(idUser string) []model.Library {
	rows, err := lr.DB.Query("SELECT * FROM library WHERE id_library IN (SELECT id_library FROM shared_library WHERE id_user = $1)", idUser)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	libraries := []model.Library{}
	for rows.Next() {
		var library model.Library
		if err := rows.Scan(&library.IdLibrary, &library.Name); err != nil {
			log.Fatal(err)
		}
		libraries = append(libraries, library)
	}
	return libraries
}
var _ interfaces.LibraryRepositoryInterface = &LibraryRepository{}