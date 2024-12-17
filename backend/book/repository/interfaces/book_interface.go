package interfaces

import (
	"book/model"
)

type BookRepositoryInterface interface {
	SelectBook(id string) (*model.Book, error)
	SelectBooks() []model.Book
	InsertBook(post model.PostBook) bool
	UpdateBook(id string) bool
	DeleteBook(id string) bool
}
