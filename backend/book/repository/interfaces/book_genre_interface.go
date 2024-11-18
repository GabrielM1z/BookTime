package interfaces

import "book/model"

type BookGenreRepositoryInterface interface {
	InsertBookGenre(post model.PostBookGenre) bool
	SelectBookGenres() []model.BookGenre
	SelectBookGenre(idGenre uint, idBook uint) (model.BookGenre, error)
	DeleteBookGenre(idGenre uint, idBook uint) bool
}
