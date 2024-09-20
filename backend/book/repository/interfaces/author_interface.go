package interfaces

import "book/model"

type AuthorRepositoryInterface interface {
	InsertAuthor(post model.PostAuthor) bool
	SelectAuthor() []model.Author
	UpdateAuthor(id int, author model.Author) bool
}
