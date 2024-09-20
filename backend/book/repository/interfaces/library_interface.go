package interfaces

import "book/model"

type LibraryRepositoryInterface interface {
	InsertLibrary(post model.PostLibrary) bool
	SelectLibrary() []model.Library
	SelectLibraryByUser(idUser string) []model.Library
}
