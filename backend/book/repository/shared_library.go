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

func (slr *SharedLibraryRepository) SelectSharedLibraries() []model.SharedLibrary {
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

func (slr *SharedLibraryRepository) SelectSharedLibrary(idUser uint, idLibrary uint) (model.SharedLibrary, error) {
	var sharedLibrary model.SharedLibrary
	stmt, err := slr.DB.Prepare("SELECT * FROM shared_library WHERE id_user = $1 and id_library = $2")
	if err != nil {
		log.Println(err)
		return sharedLibrary, err
	}
	defer stmt.Close()

	row := stmt.QueryRow(idUser, idLibrary)
	err = row.Scan(&sharedLibrary.IdUser, &sharedLibrary.IdLibrary)
	if err != nil {
		if err == sql.ErrNoRows {
			return sharedLibrary, nil // Pas de format trouvé
		}
		log.Println(err)
		return sharedLibrary, err // Erreur de lecture
	}

	return sharedLibrary, nil
}

func (slr *SharedLibraryRepository) UpdateSharedLibrary(idUser uint, idLibrary uint, sharedLibrary model.SharedLibrary) bool {
	query := `UPDATE shared_library SET id_user = $1, id_library = $2 WHERE id_user = $3 and id_library = $4`

	_, err := slr.DB.Exec(query, sharedLibrary.IdUser, sharedLibrary.IdLibrary, idUser, idLibrary)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (slr *SharedLibraryRepository) DeleteSharedLibrary(idUser uint, idLibrary uint) bool {
	query := "DELETE FROM shared_library WHERE id_user = $1 and id_library = $2"

	_, err := slr.DB.Exec(query, idUser, idLibrary)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

var _ interfaces.SharedLibraryRepositoryInterface = &SharedLibraryRepository{}
