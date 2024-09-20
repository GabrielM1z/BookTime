package interfaces

import "book/model"

type LibraryBookRepositoryInterface interface {
	InsertLibraryBook(post model.PostLibraryBook) bool
	SelectAllLibraryBook() []model.LibraryBook
	SelectLibraryBookByLibrary(idLibrary string) []model.Book
}
