package interfaces

import "book/model"

type SearchServiceInterface interface {
	SearchBooks(startIndex, query, title, author, genre string) ([]model.SimplifiedBook, error)
}
