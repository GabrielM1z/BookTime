package interfaces

import (
	"book/model"

	"github.com/google/uuid"
)

type AuthorRepositoryInterface interface {
	InsertAuthor(post model.PostAuthor) bool
	SelectAuthor(id uuid.UUID) (*model.Author, error)
	SelectAuthors() []model.Author
	UpdateAuthor(id uuid.UUID, author model.Author) bool
}
