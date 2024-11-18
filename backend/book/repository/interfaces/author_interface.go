package interfaces

import "book/model"

type AuthorRepositoryInterface interface {
	InsertAuthor(post model.PostAuthor) bool
	SelectAuthor(id int) (*model.Author, error)
	SelectAuthors() []model.Author
	UpdateAuthor(id int, author model.Author) bool
}
