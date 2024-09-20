package interfaces

import "book/model"

type BookGenreRepositoryInterface interface {
	InsertBookGenre(post model.PostBookGenre) bool
	SelectBookGenres() []*model.BookGenre
}
