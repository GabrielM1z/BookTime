package interfaces

import "book/model"

type BookRepositoryInterface interface {
	SelectBook() []model.Book
	InsertBook(post model.PostBook) bool
}
