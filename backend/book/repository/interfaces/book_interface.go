package interfaces

import "book/model"

type BookRepositoryInterface interface {
	SelectBook(id int) (*model.Book, error)
	SelectBooks() []model.Book
	InsertBook(post model.PostBook) bool
	UpdateBook(id int) bool
	DeleteBook(id int) bool
}
