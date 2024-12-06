package interfaces

import (
	"book/model"

	"github.com/google/uuid"
)

type SynchroServiceInterface interface {
	Synchro(uuid.UUID, []model.Action) ([]model.Action, error)
}
