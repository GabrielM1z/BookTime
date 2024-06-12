package interfaces

import "booktime/model"

type LibraryRepositoryInterface interface {
	InsertLibrary(post model.PostLibrary) bool
	SelectLibrary() []model.Library
}
