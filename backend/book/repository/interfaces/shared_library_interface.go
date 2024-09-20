package interfaces

import "book/model"

type SharedLibraryRepositoryInterface interface {
	InsertSharedLibrary(post model.PostSharedLibrary) bool
	SelectSharedLibrary() []model.SharedLibrary
}
