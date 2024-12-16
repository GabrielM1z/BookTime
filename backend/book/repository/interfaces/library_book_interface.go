package interfaces

import (
	"book/model"

	"github.com/google/uuid"
)

type LibraryBookRepositoryInterface interface {
	InsertLibraryBook(post model.LibraryBook, idUser uuid.UUID) bool
	SelectLibrariesBook() []model.LibraryBook
	SelectLibraryBook(id uuid.UUID) (model.LibraryBook, error)
	SelectLibraryBookByLibrary(idLibrary string) []*model.Book
	UpdateLibraryBook(id uuid.UUID, library model.LibraryBook) bool
	DeleteLibraryBook(id uuid.UUID, idUser uuid.UUID) bool
}
