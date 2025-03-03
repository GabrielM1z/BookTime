package interfaces

import (
	"user/model"

	"github.com/google/uuid"
)

type SynchroServiceInterface interface {
	Synchro(uuid.UUID, []model.Action, string) ([]model.Action, error)
}
