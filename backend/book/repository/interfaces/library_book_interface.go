package interfaces

import "book/model"

type LibraryBookRepositoryInterface interface {
	InsertLibraryBook(post model.PostLibraryBook) bool
	SelectLibrariesBook() []model.LibraryBook
	SelectLibraryBook(id uint) (model.LibraryBook, error)
	SelectLibraryBookByLibrary(idLibrary string) []*model.Book
	UpdateLibraryBook(id int, library model.LibraryBook) bool
	DeleteLibraryBook(id int) bool
}
