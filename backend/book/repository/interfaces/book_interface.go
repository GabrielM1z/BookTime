package interfaces

import (
	"book/model"

	"github.com/google/uuid"
)

type BookRepositoryInterface interface {
	SelectBook(id uuid.UUID) (*model.Book, error)
	SelectBooks() []model.Book
	InsertBook(post model.PostBook) bool
	UpdateBook(id uuid.UUID) bool
	DeleteBook(id uuid.UUID) bool
}
