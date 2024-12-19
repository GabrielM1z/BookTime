package interfaces

import "book/model"

type SearchAuthorServiceInterface interface {
	SearchAuthor(name string) (model.PostAuthor, error)
}
