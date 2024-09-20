package interfaces

import "booktime/model"

type SearchServiceInterface interface {
	SearchBooks(query, title, author, genre string) ([]model.SimplifiedBook, error);
}
