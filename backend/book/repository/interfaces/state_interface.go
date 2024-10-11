package interfaces

import "book/model"

type StateRepositoryInterface interface {
	InsertState(post model.PostState) bool
	SelectStates() []model.State
	SelectState(id uint) model.State
	SelectStateByUserAndBook(idUser, idBook uint) []model.State
	UpdateState(id int, state model.State) bool
	DeleteState(id int) bool
}
