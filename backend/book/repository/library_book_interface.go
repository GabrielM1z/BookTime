package repository

import "booktime/model"

type LibraryBookRepositoryInterface interface {
	InsertLibraryBook(post model.PostLibraryBook) bool
	SelectLibraryBook() []model.LibraryBook
}
