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

type SharedLibraryRepository struct {
	DB *sql.DB
}

func NewSharedLibraryRepository(db *sql.DB) *SharedLibraryRepository {
	return &SharedLibraryRepository{DB: db}
}

func (slr *SharedLibraryRepository) InsertSharedLibrary(sharedLibrary model.PostSharedLibrary, idUser uuid.UUID) bool {
	stmt, err := slr.DB.Prepare("INSERT INTO shared_library (id_user, id_library) VALUES ($1, $2)")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()
	_, err2 := stmt.Exec(idUser, sharedLibrary.IdLibrary)
	if err2 != nil {
		log.Println(err2)
		return false
	}

	actionMap := map[string]interface{}{
		"id_user":    idUser,
		"id_library": sharedLibrary.IdLibrary,
	}

	return slr.LogAction(idUser, "SHARED_LIBRARY", "INSERT", actionMap)
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

func (slr *SharedLibraryRepository) SelectSharedLibrary(idUser uuid.UUID, idLibrary uuid.UUID) (model.SharedLibrary, error) {
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

func (slr *SharedLibraryRepository) UpdateSharedLibrary(idUser uuid.UUID, idLibrary uuid.UUID, sharedLibrary model.SharedLibrary) bool {
	query := `UPDATE shared_library SET id_user = $1, id_library = $2 WHERE id_user = $3 and id_library = $4`

	_, err := slr.DB.Exec(query, sharedLibrary.IdUser, sharedLibrary.IdLibrary, idUser, idLibrary)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (slr *SharedLibraryRepository) DeleteSharedLibrary(idUser uuid.UUID, idLibrary uuid.UUID) bool {
	query := "DELETE FROM shared_library WHERE id_user = $1 and id_library = $2"

	_, err := slr.DB.Exec(query, idUser, idLibrary)
	if err != nil {
		log.Println(err)
		return false
	}

	actionMap := map[string]interface{}{
		"id_user":    idUser,
		"id_library": idLibrary,
	}

	return slr.LogAction(idUser, "SHARED_LIBRARY", "DELETE", actionMap)
}

func (sr *SharedLibraryRepository) LogAction(idUser uuid.UUID, tableName, actionType string, actionData map[string]interface{}) bool {
	actionJSON, err := json.Marshal(actionData)
	if err != nil {
		log.Println("Erreur lors de l'encodage JSON:", err)
		return false
	}

	action := model.PostAction{
		IdUser:     idUser,
		TableName:  tableName,
		Date:       time.Now(),
		Type:       actionType,
		Action:     actionJSON,
		ExecutedBy: "SERVER",
	}

	return NewActionRepository(sr.DB).InsertAction(action, idUser)
}

var _ interfaces.SharedLibraryRepositoryInterface = &SharedLibraryRepository{}
