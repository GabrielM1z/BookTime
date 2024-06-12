package repository

import (
	"database/sql"
	"log"

	"booktime/model"
)

type StateRepository struct {
	DB *sql.DB
}

func NewStateRepository(db *sql.DB) StateRepositoryInterface {
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

func (sr *StateRepository) SelectState() []model.State {
	var result []model.State
	rows, err := sr.DB.Query("SELECT * FROM state")
	if err != nil {
		log.Println(err)
		return nil
	}
	for rows.Next() {
		var (
			id            uint
			state         string
			progression   uint
			readCount     uint
			lastReadDate  string
			isAvailable   bool
			userId, bookId uint
		)
		err := rows.Scan(&id, &state, &progression, &readCount, &lastReadDate, &isAvailable, &userId, &bookId)
		if err != nil {
			log.Println(err)
		} else {
			state := model.State{IdState: id, State: state, Progression: progression, ReadCount: readCount, LastReadDate: lastReadDate, IsAvailable: isAvailable, IdUser: userId, IdBook: bookId}
			result = append(result, state)
		}
	}
	return result
}
