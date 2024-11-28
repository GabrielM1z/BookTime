package interfaces

import "book/model"

type SearchServiceInterface interface {
	SearchBooks(query, title, author, genre string) ([]model.SimplifiedBook, error)
}
