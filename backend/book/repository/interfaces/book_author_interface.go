package interfaces

import (
	"book/model"

	"github.com/google/uuid"
)

type BookAuthorRepositoryInterface interface {
	InsertBookAuthor(post model.BookAuthor) bool
	SelectBookAuthors() []model.BookAuthor
	SelectBookAuthor(idAuthor uuid.UUID, idBook uuid.UUID) (model.BookAuthor, error)
	DeleteBookAuthor(idAuthor uuid.UUID, idBook uuid.UUID) bool
}
