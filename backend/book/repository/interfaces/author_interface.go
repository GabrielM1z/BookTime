package interfaces

import "booktime/model"

type AuthorRepositoryInterface interface {
	InsertAuthor(post model.PostAuthor) bool
	SelectAuthor() []model.Author
}
