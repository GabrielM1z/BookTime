package repository

import (
	"database/sql"
	"log"

	"book/model"
	"book/repository/interfaces"
)

type StateRepository struct {
	DB *sql.DB
}

func NewStateRepository(db *sql.DB) *StateRepository {
	return &StateRepository{DB: db}
}

func (sr *StateRepository) InsertState(post model.PostState) bool {
	stmt, err := sr.DB.Prepare("INSERT INTO state (state, progression, read_count, last_read_date, is_available, id_user, id_book) VALUES ($1, $2, $3, $4, $5, $6, $7)")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()
	_, err2 := stmt.Exec(post.State, post.Progression, post.ReadCount, post.LastReadDate, post.IsAvailable, post.IdUser, post.IdBook)
	if err2 != nil {
		log.Println(err2)
		return false
	}
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
		if err := rows.Scan(&state.IdState, &state.State, &state.Progression, &state.ReadCount, &state.LastReadDate, &state.IdUser, &state.IdBook, &state.IsAvailable); err != nil {
			log.Fatal(err)
		}
		states = append(states, state)
	}
	return states
}

func (sr *StateRepository) SelectStateByUserAndBook(idUser, idBook uint) []model.State {
	rows, err := sr.DB.Query("SELECT * FROM state WHERE id_user = $1 AND id_book = $2", idUser, idBook)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	states := []model.State{}
	for rows.Next() {
		var state model.State
		if err := rows.Scan(&state.IdState, &state.State, &state.Progression, &state.ReadCount, &state.LastReadDate, &state.IdUser, &state.IdBook, &state.IsAvailable); err != nil {
			log.Fatal(err)
		}
		states = append(states, state)
	}
	return states
}

func (sr *StateRepository) SelectState(idState uint) model.State {
	rows, err := sr.DB.Query("SELECT * FROM state WHERE id_state = $1", idState)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	states := []model.State{}
	for rows.Next() {
		var state model.State
		if err := rows.Scan(&state.IdState, &state.State, &state.Progression, &state.ReadCount, &state.LastReadDate, &state.IdUser, &state.IdBook, &state.IsAvailable); err != nil {
			log.Fatal(err)
		}
		states = append(states, state)
	}
	return states[0]
}

func (sr *StateRepository) UpdateState(idState int, state model.State) bool {
	query := `UPDATE state SET state = $1, progression = $2, read_count = $3, last_read_date = $4, is_available = $5
			  WHERE id_state = $6`

	_, err := sr.DB.Exec(query, state.State, state.Progression, state.ReadCount, state.LastReadDate, state.IsAvailable, idState)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (sr *StateRepository) DeleteState(idState int) bool {
	query := "DELETE FROM state WHERE id_state = $1"

	_, err := sr.DB.Exec(query, idState)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

var _ interfaces.StateRepositoryInterface = &StateRepository{}
