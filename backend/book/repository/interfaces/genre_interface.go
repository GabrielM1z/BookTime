package interfaces

import (
	"book/model"

	"github.com/google/uuid"
)

type GenreRepositoryInterface interface {
	InsertGenre(post model.PostGenre) bool
	SelectGenres() []model.Genre
	SelectGenre(id uuid.UUID) (model.Genre, error)
	UpdateGenre(id uuid.UUID, genre model.Genre) bool
	DeleteGenre(id uuid.UUID) bool
}
