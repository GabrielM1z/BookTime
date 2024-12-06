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

func (sr *StateRepository) InsertState(state model.State) bool {
	stmt, err := sr.DB.Prepare("INSERT INTO state (state, progression, read_count, last_read_date, is_available, id_user, id_book) VALUES ($1, $2, $3, $4, $5, $6, $7)")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()

	_, err2 := stmt.Exec(state.State, state.Progression, state.ReadCount, state.LastReadDate, state.IsAvailable, state.IdUser, state.IdBook)
	if err2 != nil {
		log.Println(err2)
		return false
	}

	actionMap := map[string]interface{}{
		"state":          state.State,
		"progression":    state.Progression,
		"readcount":      state.ReadCount,
		"last_read_date": state.LastReadDate,
		"is_available":   state.IsAvailable,
		"id_user":        state.IdUser,
		"id_book":        state.IdBook,
	}

	return sr.LogAction(state.IdUser, "STATE", "INSERT", actionMap)
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

func (sr StateRepository) SelectStateByUserAndBook(idUser uuid.UUID, idBook uuid.UUID) model.State {
	log.Println("SelectStateByUserAndBook with : ")
	log.Println("idUser")
	log.Println(idUser)
	log.Println("idBook")
	log.Println(idBook)
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
	log.Println("REPOSITORY : UpdateState")

	baseState := sr.SelectStateByUserAndBook(idUser, idBook)

	log.Println("REPOSITORY : after basestate")

	query := "UPDATE state SET "
	params := []interface{}{}
	counter := 1 // Compteur pour les paramètres SQL ($1, $2, etc.)

	// Ajout des champs dynamiquement en fonction des valeurs non nulles
	if state.State != "" || state.Progression != 0 || state.ReadCount != 0 || state.LastReadDate != "" || state.IsAvailable != baseState.IsAvailable {
		if state.State != "" {
			query += "state = $" + fmt.Sprint(counter) + ", "
			params = append(params, state.State)
			counter++
		}
		if state.Progression != 0 {
			query += "progression = $" + fmt.Sprint(counter) + ", "
			params = append(params, state.Progression)
			counter++
		}
		if state.ReadCount != 0 {
			query += "read_count = $" + fmt.Sprint(counter) + ", "
			params = append(params, state.ReadCount)
			counter++
		}
		if state.LastReadDate != "" {
			query += "last_read_date = $" + fmt.Sprint(counter) + ", "
			params = append(params, state.LastReadDate)
			counter++
		}
		if state.IsAvailable != baseState.IsAvailable { // Comparaison avec l'état de base
			query += "is_available = $" + fmt.Sprint(counter) + ", "
			params = append(params, state.IsAvailable)
			counter++
		}

		// Suppression de la virgule finale et ajout des conditions WHERE
		query = query[:len(query)-2] + " WHERE id_user = $" + fmt.Sprint(counter) +
			" AND id_book = $" + fmt.Sprint(counter+1)

		// Ajout des paramètres pour les conditions WHERE
		params = append(params, idUser, idBook)

		// Exécution de la requête
		_, err := sr.DB.Exec(query, params...)
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
			actionMap["read_count"] = state.ReadCount
		}

		parsedBaseDate, _ := time.Parse(time.RFC3339, baseState.LastReadDate)
		parsedStateDate, _ := time.Parse("2006-01-02", state.LastReadDate)
		if !parsedBaseDate.Truncate(24 * time.Hour).Equal(parsedStateDate) {
			actionMap["last_read_date"] = state.LastReadDate
		}

		if baseState.IsAvailable != state.IsAvailable {
			actionMap["is_available"] = state.IsAvailable
		}

		if len(actionMap) == 0 {
			return true
		}

		actionMap["id_user"] = idUser.String()
		actionMap["id_book"] = idBook.String()

		return sr.LogAction(idUser, "STATE", "UPDATE", actionMap)
	}
	return true
}

func (sr *StateRepository) DeleteState(idUser uuid.UUID, idBook uuid.UUID) bool {
	query := "DELETE FROM state WHERE id_user = $1 AND id_book = $2"
	_, err := sr.DB.Exec(query, idUser, idBook)
	if err != nil {
		log.Println(err)
		return false
	}

	actionMap := map[string]interface{}{
		"id_user": idUser,
		"id_book": idBook,
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
