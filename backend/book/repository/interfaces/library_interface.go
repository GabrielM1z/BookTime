package interfaces

import (
	"book/model"

	"github.com/google/uuid"
)

type LibraryRepositoryInterface interface {
	InsertLibrary(post model.PostLibrary, idUser uuid.UUID) bool
	SelectLibraries() []model.Library
	SelectLibrary(id uuid.UUID) (model.Library, error)
	SelectLibraryByUser(idUser uuid.UUID) []model.Library
	UpdateLibrary(id uuid.UUID, library model.Library, idUser uuid.UUID) bool
	DeleteLibrary(id uuid.UUID, idUser uuid.UUID) bool
}
