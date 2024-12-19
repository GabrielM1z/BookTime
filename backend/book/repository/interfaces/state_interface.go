package interfaces

import (
	"book/model"

	"github.com/google/uuid"
)

type StateRepositoryInterface interface {
	InsertState(state model.State) bool
	SelectStates() []model.State
	SelectStateByUserAndBook(idUser uuid.UUID, idBook string) model.State
	UpdateState(idUser uuid.UUID, idBook string, state model.State) bool
	DeleteState(idUser uuid.UUID, idBook string) bool
}
