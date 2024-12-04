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

	actionMap := map[string]interface{}{
		"state":        post.State,
		"progression":  post.Progression,
		"readCount":    post.ReadCount,
		"lastReadDate": post.LastReadDate,
		"isAvailable":  post.IsAvailable,
		"idUser":       idUser,
		"idBook":       post.IdBook,
	}

	return sr.LogAction(idUser, "STATE", "INSERT", actionMap)
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

	parsedBaseDate, _ := time.Parse(time.RFC3339, baseState.LastReadDate)
	parsedStateDate, _ := time.Parse("2006-01-02", state.LastReadDate)
	if !parsedBaseDate.Truncate(24 * time.Hour).Equal(parsedStateDate) {
		actionMap["lastReadDate"] = state.LastReadDate
	}

	if baseState.IsAvailable != state.IsAvailable {
		actionMap["isAvailable"] = state.IsAvailable
	}

	if len(actionMap) == 0 {
		return true
	}

	actionMap["idUser"] = idUser.String()
	actionMap["idBook"] = idBook.String()

	return sr.LogAction(idUser, "STATE", "UPDATE", actionMap)
}

func (sr *StateRepository) DeleteState(idUser uuid.UUID, idBook uuid.UUID) bool {
	query := "DELETE FROM state WHERE id_user = $1 AND id_book = $2"
	_, err := sr.DB.Exec(query, idUser, idBook)
	if err != nil {
		log.Println(err)
		return false
	}

	actionMap := map[string]interface{}{
		"idUser": idUser,
		"idBook": idBook,
	}

	return sr.LogAction(idUser, "STATE", "DELETE", actionMap)
}

func (sr *StateRepository) LogAction(idUser uuid.UUID, tableName, actionType string, actionData map[string]interface{}) bool {
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

	return NewActionRepository(sr.DB).InsertAction(action, idUser)
}

var _ interfaces.StateRepositoryInterface = &StateRepository{}
