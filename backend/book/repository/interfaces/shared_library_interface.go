package interfaces

import "book/model"

type SharedLibraryRepositoryInterface interface {
	InsertSharedLibrary(post model.PostSharedLibrary) bool
	SelectSharedLibraries() []model.SharedLibrary
	SelectSharedLibrary(idUser uint, idLibrary uint) (model.SharedLibrary, error)
	UpdateSharedLibrary(idUser uint, idLibrary uint, sharedLibrary model.SharedLibrary) bool
	DeleteSharedLibrary(idUser uint, idLibrary uint) bool
}
