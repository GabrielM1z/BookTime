package interfaces

import (
	"book/model"
	"time"

	"github.com/google/uuid"
)

type SharedLibraryRepositoryInterface interface {
	InsertSharedLibrary(post model.PostSharedLibrary, idUser uuid.UUID, actionDate ...time.Time) bool
	SelectSharedLibraries() []model.SharedLibrary
	SelectSharedLibrary(idUser uuid.UUID, idLibrary uuid.UUID) (model.SharedLibrary, error)
	UpdateSharedLibrary(idUser uuid.UUID, idLibrary uuid.UUID, sharedLibrary model.SharedLibrary) bool
	DeleteSharedLibrary(idUser uuid.UUID, idLibrary uuid.UUID, actionDate ...time.Time) bool
}
