package interfaces

import "book/model"

type StateRepositoryInterface interface {
	InsertState(post model.PostState) bool
	SelectState() []model.State
	SelectStateByUserAndBook(idUser, idBook string) []model.State
}
