package repository

import "booktime/model"

type SharedLibraryRepositoryInterface interface {
	InsertSharedLibrary(post model.PostSharedLibrary) bool
	SelectSharedLibrary() []model.SharedLibrary
}
