package interfaces

import (
	"book/model"

	"github.com/google/uuid"
)

type BookGenreRepositoryInterface interface {
	InsertBookGenre(post model.BookGenre) bool
	SelectBookGenres() []model.BookGenre
	SelectBookGenre(idGenre uuid.UUID, idBook uuid.UUID) (model.BookGenre, error)
	DeleteBookGenre(idGenre uuid.UUID, idBook uuid.UUID) bool
}
