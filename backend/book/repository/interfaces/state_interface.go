package interfaces

import (
	"book/model"

	"github.com/google/uuid"
)

type StateRepositoryInterface interface {
	InsertState(post model.PostState, idUser uuid.UUID) bool
	SelectStates() []model.State
	SelectStateByUserAndBook(idUser uuid.UUID, idBook uuid.UUID) model.State
	UpdateState(idUser uuid.UUID, idBook uuid.UUID, state model.State) bool
	DeleteState(idUser uuid.UUID, idBook uuid.UUID) bool
}
