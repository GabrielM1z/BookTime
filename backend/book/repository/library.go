package repository

import (
	"database/sql"
	"log"

	"book/model"
	"book/repository/interfaces"
)

type LibraryRepository struct {
	DB *sql.DB
}

func NewLibraryRepository(db *sql.DB) *LibraryRepository {
	return &LibraryRepository{DB: db}
}

// InsertLibrary - Insère une nouvelle bibliothèque
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

// SelectLibraries - Sélectionne toutes les bibliothèques
func (lr *LibraryRepository) SelectLibraries() []model.Library {
	var result []model.Library
	rows, err := lr.DB.Query("SELECT * FROM library")
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
			library := model.Library{IdLibrary: id, Name: name}
			result = append(result, library)
		}
	}
	return result
}

// SelectLibrary - Sélectionne une bibliothèque par ID
func (lr *LibraryRepository) SelectLibrary(id uint) (model.Library, error) {
	var library model.Library
	stmt, err := lr.DB.Prepare("SELECT * FROM library WHERE id_library = $1")
	if err != nil {
		log.Println(err)
		return library, err
	}
	defer stmt.Close()

	row := stmt.QueryRow(id)
	err = row.Scan(&library.IdLibrary, &library.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			return library, nil
		}
		log.Println(err)
		return library, err
	}

	return library, nil
}

// UpdateLibrary - Met à jour une bibliothèque
func (lr *LibraryRepository) UpdateLibrary(id int, library model.Library) bool {
	query := `UPDATE library SET name = $1 WHERE id_library = $2`

	_, err := lr.DB.Exec(query, library.Name, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

// DeleteLibrary - Supprime une bibliothèque par ID
func (lr *LibraryRepository) DeleteLibrary(id int) bool {
	query := "DELETE FROM library WHERE id_library = $1"

	_, err := lr.DB.Exec(query, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (lr *LibraryRepository) SelectLibraryByUser(idUser uint) []model.Library {
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
