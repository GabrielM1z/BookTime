package interfaces

import (
	"book/model"

	"github.com/google/uuid"
)

type ActionRepositoryInterface interface {
	InsertAction(post model.PostAction, idUser uuid.UUID) bool
	SelectActions(idUser uuid.UUID) []model.Action
	SelectActionsFromDate(idUser uuid.UUID, lastSyncDate string) []model.Action
	SelectAction(idUser uuid.UUID, idAction uuid.UUID) model.Action
	UpdateAction(idUser uuid.UUID, idAction uuid.UUID, action model.Action) bool
	DeleteAction(idUser uuid.UUID, idAction uuid.UUID) bool
}
