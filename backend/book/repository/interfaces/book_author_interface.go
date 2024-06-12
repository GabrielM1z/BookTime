package interfaces

import "booktime/model"

type BookAuthorRepositoryInterface interface {
	InsertBookAuthor(post model.PostBookAuthor) bool
	SelectBookAuthor() []model.BookAuthor
}
