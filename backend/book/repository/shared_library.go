package repository

import (
	"database/sql"
	"log"

	"book/model"
	"book/repository/interfaces"
)

type SharedLibraryRepository struct {
	DB *sql.DB
}

func NewSharedLibraryRepository(db *sql.DB) *SharedLibraryRepository {
	return &SharedLibraryRepository{DB: db}
}

func (slr *SharedLibraryRepository) InsertSharedLibrary(post model.PostSharedLibrary) bool {
	stmt, err := slr.DB.Prepare("INSERT INTO shared_library (id_user, id_library) VALUES ($1, $2)")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()
	_, err2 := stmt.Exec(post.UserId, post.LibraryId)
	if err2 != nil {
		log.Println(err2)
		return false
	}
	return true
}

func (slr *SharedLibraryRepository) SelectSharedLibrary() []model.SharedLibrary {
	rows, err := slr.DB.Query("SELECT * FROM shared_library")
	if err != nil {
		log.Println(err)
		return nil
	}
	var sharedLibraries []model.SharedLibrary
	for rows.Next() {
		var sharedLibrary model.SharedLibrary
		if err := rows.Scan(&sharedLibrary.IdUser, &sharedLibrary.IdLibrary); err != nil {
			log.Println(err)
		}
		sharedLibraries = append(sharedLibraries, sharedLibrary)
	}
	return sharedLibraries
}

var _ interfaces.SharedLibraryRepositoryInterface = &SharedLibraryRepository{}
