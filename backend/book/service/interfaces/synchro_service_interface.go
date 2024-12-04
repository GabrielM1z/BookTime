package interfaces

import "book/model"

type SynchroServiceInterface interface {
	Synchro([]model.Action) ([]model.Action, error)
}
