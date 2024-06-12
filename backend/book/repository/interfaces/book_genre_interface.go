package interfaces

import "booktime/model"

type BookGenreRepositoryInterface interface {
	InsertBookGenre(post model.PostBookGenre) bool
	SelectBookGenres() []*model.BookGenre
}