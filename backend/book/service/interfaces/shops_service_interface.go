package interfaces

import "book/model"

type ShopsServiceInterface interface {
	//ShopsBooks(query, title, author, genre string) ([]model.SimplifiedBook, error)
	ShopsBooks(isbn string) ([]model.BookInfo, error)
}
