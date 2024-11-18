package interfaces

import "book/model"

type GenreRepositoryInterface interface {
	InsertGenre(post model.PostGenre) bool
	SelectGenres() []model.Genre
	SelectGenre(id uint) (model.Genre, error)
	UpdateGenre(id int, genre model.Genre) bool
	DeleteGenre(id int) bool
}
