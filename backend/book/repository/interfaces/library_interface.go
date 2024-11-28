package interfaces

import "book/model"

type LibraryRepositoryInterface interface {
	InsertLibrary(post model.PostLibrary) bool
	SelectLibraries() []model.Library
	SelectLibrary(id uint) (model.Library, error)
	SelectLibraryByUser(idUser uint) []model.Library
	UpdateLibrary(id int, library model.Library) bool
	DeleteLibrary(id int) bool
}
