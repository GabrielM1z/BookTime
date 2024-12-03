package repository

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"book/model"
	"book/repository/interfaces"

	"github.com/google/uuid"
)

type StateRepository struct {
	DB *sql.DB
}

func NewStateRepository(db *sql.DB) *StateRepository {
	return &StateRepository{DB: db}
}

func (sr *StateRepository) InsertState(post model.PostState, idUser uuid.UUID) bool {
	stmt, err := sr.DB.Prepare("INSERT INTO state (state, progression, read_count, last_read_date, is_available, id_user, id_book) VALUES ($1, $2, $3, $4, $5, $6, $7)")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()
	_, err2 := stmt.Exec(post.State, post.Progression, post.ReadCount, post.LastReadDate, post.IsAvailable, idUser, post.IdBook)
	if err2 != nil {
		log.Println(err2)
		return false
	}

	actionmap := map[string]interface{}{
		"state":        post.State,
		"progression":  post.Progression,
		"readCount":    post.ReadCount,
		"lastReadDate": post.LastReadDate,
		"isAvailable":  post.IsAvailable,
		"idUser":       idUser,
		"idBook":       post.IdBook,
	}

	actionJSON, err := json.Marshal(actionmap)
	if err != nil {
		fmt.Println("Erreur lors de l'encodage JSON:", err)
		return false
	}

	var action = model.PostAction{IdUser: idUser,
		Table:      "STATE",
		Date:       time.Now(),
		Type:       "INSERT",
		Action:     actionJSON,
		ExecutedBy: "SERVER"}

	NewActionRepository(sr.DB).InsertAction(action, idUser)

	return true
}

func (ar *StateRepository) SelectStates() []model.State {
	query := "SELECT * FROM state"
	rows, err := ar.DB.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	states := []model.State{}
	for rows.Next() {
		var state model.State
		if err := rows.Scan(&state.State, &state.Progression, &state.ReadCount, &state.LastReadDate, &state.IdUser, &state.IdBook, &state.IsAvailable); err != nil {
			log.Fatal(err)
		}
		states = append(states, state)
	}
	return states
}

func (sr *StateRepository) SelectStateByUserAndBook(idUser uuid.UUID, idBook uuid.UUID) model.State {
	rows, err := sr.DB.Query("SELECT * FROM state WHERE id_user = $1 AND id_book = $2", idUser, idBook)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	states := []model.State{}
	for rows.Next() {
		var state model.State
		if err := rows.Scan(&state.State, &state.Progression, &state.ReadCount, &state.LastReadDate, &state.IdUser, &state.IdBook, &state.IsAvailable); err != nil {
			log.Fatal(err)
		}
		states = append(states, state)
	}
	return states[0]
}

func (sr *StateRepository) UpdateState(idUser uuid.UUID, idBook uuid.UUID, state model.State) bool {
	baseState := sr.SelectStateByUserAndBook(idUser, idBook)

	query := `UPDATE state SET state = $1, progression = $2, read_count = $3, last_read_date = $4, is_available = $5
			  WHERE id_user = $6 AND id_book = $7`

	_, err := sr.DB.Exec(query, state.State, state.Progression, state.ReadCount, state.LastReadDate, state.IsAvailable, idUser, idBook)
	if err != nil {
		log.Println(err)
		return false
	}

	actionMap := map[string]interface{}{}

	if baseState.State != state.State {
		actionMap["state"] = state.State
	}
	if baseState.Progression != state.Progression {
		actionMap["progression"] = state.Progression
	}
	if baseState.ReadCount != state.ReadCount {
		actionMap["readCount"] = state.ReadCount
	}

	// Comparer les dates sans tenir compte de l'heure
	parsedBaseDate, err1 := time.Parse(time.RFC3339, baseState.LastReadDate)
	parsedStateDate, err2 := time.Parse("2006-01-02", state.LastReadDate)

	// Si la date de base est dans le format complet (avec heure) et celle de l'état est sans heure
	if err1 == nil && err2 == nil {
		// Comparer uniquement les dates (en ignorant l'heure)
		parsedBaseDate = parsedBaseDate.UTC().Truncate(24 * time.Hour)   // Ignorer l'heure
		parsedStateDate = parsedStateDate.UTC().Truncate(24 * time.Hour) // Ignorer l'heure

		if !parsedBaseDate.Equal(parsedStateDate) {
			actionMap["lastReadDate"] = state.LastReadDate
		}
	} else if baseState.LastReadDate != state.LastReadDate {
		// Si l'une des deux dates n'est pas dans le bon format, on les compare comme des chaînes
		actionMap["lastReadDate"] = state.LastReadDate
	}
	if baseState.IsAvailable != state.IsAvailable {
		actionMap["isAvailable"] = state.IsAvailable
	}

	if len(actionMap) == 0 {
		return true
	}

	// Convertir idUser et idBook en chaînes
	actionMap["idUser"] = idUser.String()
	actionMap["idBook"] = idBook.String()

	actionJSON, err := json.Marshal(actionMap)
	if err != nil {
		log.Println("Erreur lors de l'encodage JSON:", err)
		return false
	}

	var action = model.PostAction{
		Table:      "STATE",
		IdUser:     idUser,
		Date:       time.Now(),
		Type:       "UPDATE",
		Action:     actionJSON,
		ExecutedBy: "SERVER",
	}

	NewActionRepository(sr.DB).InsertAction(action, idUser)

	return true
}

func (sr *StateRepository) DeleteState(idUser uuid.UUID, idBook uuid.UUID) bool {
	query := "DELETE FROM state WHERE id_user = $1 AND id_book = $2"

	_, err := sr.DB.Exec(query, idUser, idBook)
	if err != nil {
		log.Println(err)
		return false
	}

	actionMap := map[string]interface{}{}
	actionMap["idUser"] = idUser
	actionMap["idBook"] = idBook

	actionJSON, err := json.Marshal(actionMap)
	if err != nil {
		fmt.Println("Erreur lors de l'encodage JSON:", err)
		return false
	}

	var action = model.PostAction{IdUser: idUser,
		Table:      "STATE",
		Date:       time.Now(),
		Type:       "DELETE",
		Action:     actionJSON,
		ExecutedBy: "SERVER"}

	NewActionRepository(sr.DB).InsertAction(action, idUser)

	return true
}

var _ interfaces.StateRepositoryInterface = &StateRepository{}
