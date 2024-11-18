package interfaces

import "book/model"

type BookAuthorRepositoryInterface interface {
	InsertBookAuthor(post model.PostBookAuthor) bool
	SelectBookAuthors() []model.BookAuthor
	SelectBookAuthor(idAuthor uint, idBook uint) (model.BookAuthor, error)
	DeleteBookAuthor(idAuthor uint, idBook uint) bool
}
