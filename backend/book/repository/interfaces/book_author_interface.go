package interfaces

import "book/model"

type BookAuthorRepositoryInterface interface {
	InsertBookAuthor(post model.PostBookAuthor) bool
	SelectBookAuthor() []model.BookAuthor
}
