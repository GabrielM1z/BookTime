package interfaces

import (
	"book/model"
	"time"

	"github.com/google/uuid"
)

type LibraryBookRepositoryInterface interface {
	InsertLibraryBook(post model.LibraryBook, idUser uuid.UUID, actionDate *time.Time) bool
	SelectLibrariesBook() []model.LibraryBook
	SelectLibraryBook(id uuid.UUID) (model.LibraryBook, error)
	SelectLibraryBookByLibrary(idLibrary string) []*model.Book
	UpdateLibraryBook(id uuid.UUID, library model.LibraryBook) bool
	DeleteLibraryBook(id uuid.UUID, idUser uuid.UUID, actionDate *time.Time) bool
}
