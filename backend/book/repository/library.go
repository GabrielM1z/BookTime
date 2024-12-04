package repository

import (
	"database/sql"
	"encoding/json"
	"log"
	"time"

	"book/model"
	"book/repository/interfaces"

	"github.com/google/uuid"
)

type LibraryRepository struct {
	DB *sql.DB
}

func NewLibraryRepository(db *sql.DB) *LibraryRepository {
	return &LibraryRepository{DB: db}
}

// InsertLibrary - Insère une nouvelle bibliothèque
func (lr *LibraryRepository) InsertLibrary(post model.PostLibrary, idUser uuid.UUID) bool {
	var libraryID uuid.UUID

	query := "INSERT INTO library (name) VALUES ($1) RETURNING id_library"
	stmt, err := lr.DB.Prepare(query)
	if err != nil {
		log.Println("Error preparing statement:", err)
		return false
	}
	defer stmt.Close()

	// Exécuter la requête et récupérer l'ID
	err = stmt.QueryRow(post.Name).Scan(&libraryID)
	if err != nil {
		log.Println("Error executing query:", err)
		return false
	}

	actionMap := map[string]interface{}{
		"name":      post.Name,
		"idLibrary": libraryID,
	}

	return lr.LogAction(idUser, "LIBRARY", "INSERT", actionMap)
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
			id   uuid.UUID
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
func (lr *LibraryRepository) SelectLibrary(id uuid.UUID) (model.Library, error) {
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
func (lr *LibraryRepository) UpdateLibrary(id uuid.UUID, library model.Library) bool {
	query := `UPDATE library SET name = $1 WHERE id_library = $2`

	_, err := lr.DB.Exec(query, library.Name, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

// DeleteLibrary - Supprime une bibliothèque par ID
func (lr *LibraryRepository) DeleteLibrary(id uuid.UUID) bool {
	query := "DELETE FROM library WHERE id_library = $1"

	_, err := lr.DB.Exec(query, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (lr *LibraryRepository) SelectLibraryByUser(idUser uuid.UUID) []model.Library {
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

func (lr *LibraryRepository) LogAction(idUser uuid.UUID, tableName, actionType string, actionData map[string]interface{}) bool {
	actionJSON, err := json.Marshal(actionData)
	if err != nil {
		log.Println("Erreur lors de l'encodage JSON:", err)
		return false
	}

	action := model.PostAction{
		IdUser:     idUser,
		Table:      tableName,
		Date:       time.Now(),
		Type:       actionType,
		Action:     actionJSON,
		ExecutedBy: "SERVER",
	}

	return NewActionRepository(lr.DB).InsertAction(action, idUser)
}

var _ interfaces.LibraryRepositoryInterface = &LibraryRepository{}
