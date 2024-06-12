package repository

import (
	"database/sql"
	"log"

	"booktime/model"
    "booktime/repository/interfaces"
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
	var result []model.SharedLibrary
	rows, err := slr.DB.Query("SELECT * FROM shared_library")
	if err != nil {
		log.Println(err)
		return nil
	}
	for rows.Next() {
		var (
			id        uint
			userId    uint
			libraryId uint
		)
		err := rows.Scan(&id, &userId, &libraryId)
		if err != nil {
			log.Println(err)
		} else {
			sharedLibrary := model.SharedLibrary{IdUser: userId, IdLibrary: libraryId}
			result = append(result, sharedLibrary)
		}
	}
	return result
}
var _ interfaces.SharedLibraryRepositoryInterface = &SharedLibraryRepository{}