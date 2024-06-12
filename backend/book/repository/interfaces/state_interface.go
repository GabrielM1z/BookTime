package interfaces

import "booktime/model"

type StateRepositoryInterface interface {
	InsertState(post model.PostState) bool
	SelectState() []model.State
}
