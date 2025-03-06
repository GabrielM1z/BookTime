package interfaces

import (
	"book/model"
	"time"

	"github.com/google/uuid"
)

type LibraryRepositoryInterface interface {
	InsertLibrary(library model.Library, idUser uuid.UUID, actionDate ...time.Time) bool
	SelectLibraries() []model.Library
	SelectLibrary(id uuid.UUID) (model.Library, error)
	SelectLibraryByUser(idUser uuid.UUID) []model.Library
	UpdateLibrary(library model.Library, idUser uuid.UUID, actionDate ...time.Time) bool
	DeleteLibrary(id uuid.UUID, idUser uuid.UUID, actionDate ...time.Time) bool
}
