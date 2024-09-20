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

func (ar *StateRepository) SelectState() []model.State {
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

func (sr *StateRepository) SelectStateByUserAndBook(idUser, idBook string) []model.State {
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

var _ interfaces.StateRepositoryInterface = &StateRepository{}
