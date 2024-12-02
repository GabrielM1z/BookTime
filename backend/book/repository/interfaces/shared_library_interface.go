package interfaces

import "book/model"

type SharedLibraryRepositoryInterface interface {
	InsertSharedLibrary(post model.PostSharedLibrary, idUser string) bool
	SelectSharedLibraries() []model.SharedLibrary
	SelectSharedLibrary(idUser string, idLibrary uint) (model.SharedLibrary, error)
	UpdateSharedLibrary(idUser string, idLibrary uint, sharedLibrary model.SharedLibrary) bool
	DeleteSharedLibrary(idUser string, idLibrary uint) bool
}
