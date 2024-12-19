package interfaces

import "book/model"

type SearchAuthorServiceInterface interface {
	SearchAuthor(name string) (model.PostAuthor, error)
	GetAuthorByName(name string) (*model.Author, error)
}
