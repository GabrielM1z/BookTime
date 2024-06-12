package interfaces

import "booktime/model"

type GenreRepositoryInterface interface {
	InsertGenre(post model.PostGenre) bool
	SelectGenre() []model.Genre
}
