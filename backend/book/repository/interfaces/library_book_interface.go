package interfaces

import (
	"book/model"

	"github.com/google/uuid"
)

type LibraryBookRepositoryInterface interface {
	InsertLibraryBook(post model.PostLibraryBook) bool
	SelectLibrariesBook() []model.LibraryBook
	SelectLibraryBook(id uuid.UUID) (model.LibraryBook, error)
	SelectLibraryBookByLibrary(idLibrary string) []*model.Book
	UpdateLibraryBook(id uuid.UUID, library model.LibraryBook) bool
	DeleteLibraryBook(id uuid.UUID) bool
}
