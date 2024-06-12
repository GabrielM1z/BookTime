package interfaces

import "booktime/model"

type BookRepositoryInterface interface {
	SelectBook() []model.Book
	InsertBook(post model.PostBook) bool
}
