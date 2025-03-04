package interfaces

import (
	"book/model"
	"time"

	"github.com/google/uuid"
)

type StateRepositoryInterface interface {
	InsertState(state model.State, actionDate ...time.Time) bool
	SelectStates() []model.State
	SelectStateByUserAndBook(idUser uuid.UUID, idBook string) (model.State, error)
	UpdateState(idUser uuid.UUID, idBook string, state model.State, actionDate ...time.Time) bool
	DeleteState(idUser uuid.UUID, idBook string, actionDate ...time.Time) bool
}
