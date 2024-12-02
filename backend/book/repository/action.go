package repository

import (
	"database/sql"
	"log"

	"book/model"
	"book/repository/interfaces"

	"github.com/google/uuid"
)

type ActionRepository struct {
	DB *sql.DB
}

func NewActionRepository(db *sql.DB) *ActionRepository {
	return &ActionRepository{DB: db}
}

func (ar *ActionRepository) InsertAction(post model.PostAction, idUser uuid.UUID) bool {
	stmt, err := ar.DB.Prepare("INSERT INTO action (id_user, date, type, action, executed_by) VALUES ($1, $2, $3, $4, $5)")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()
	_, err2 := stmt.Exec(post.IdUser, post.Date, post.Type, post.Action, post.ExecutedBy)
	if err2 != nil {
		log.Println(err2)
		return false
	}
	return true
}

func (ar *ActionRepository) SelectActions() []model.Action {
	query := "SELECT * FROM action"
	rows, err := ar.DB.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	actions := []model.Action{}
	for rows.Next() {
		var action model.Action
		if err := rows.Scan(&action.IdAction, &action.IdUser, &action.Date, &action.Type, &action.Action, &action.ExecutedBy); err != nil {
			log.Fatal(err)
		}
		actions = append(actions, action)
	}
	return actions
}

func (ar *ActionRepository) SelectAction(idUser uuid.UUID, idAction uuid.UUID) model.Action {
	var action model.Action
	stmt, err := ar.DB.Prepare("SELECT * FROM action WHERE id_user = $1 and id_action = $2")

	if err != nil {
		log.Println(err)
		return action
	}
	defer stmt.Close()

	row := stmt.QueryRow(idUser, idAction)
	err = row.Scan(&action.IdUser, &action.IdAction)
	if err != nil {
		if err == sql.ErrNoRows {
			return action // Pas de format trouvé
		}
		log.Println(err)
		return action // Erreur de lecture
	}

	return action
}

func (ar *ActionRepository) UpdateAction(idUser uuid.UUID, idAction uuid.UUID, action model.Action) bool {
	query := `UPDATE action SET action = $1, progression = $2, read_count = $3, last_read_date = $4, is_available = $5
			  WHERE id_user = $6 AND id_action = $7`

	_, err := ar.DB.Exec(query, action.Date, action.Type, action.Action, action.ExecutedBy, idUser, idAction)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (ar *ActionRepository) DeleteAction(idUser uuid.UUID, idAction uuid.UUID) bool {
	query := "DELETE FROM action WHERE id_user = $1 AND id_action = $2"

	_, err := ar.DB.Exec(query, idUser, idAction)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

var _ interfaces.ActionRepositoryInterface = &ActionRepository{}
