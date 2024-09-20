package interfaces

import "book/model"

type GenreRepositoryInterface interface {
	InsertGenre(post model.PostGenre) bool
	SelectGenre() []model.Genre
}
