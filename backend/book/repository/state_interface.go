package repository

import "booktime/model"

type StateRepositoryInterface interface {
	InsertState(post model.PostState) bool
	SelectState() []model.State
	SelectStateByUserAndBook(idUser, idBook string) []model.State
}
