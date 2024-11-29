package interfaces

import "news/model"

type NewsServiceInterface interface {
	SearchNews(topic string) ([]model.Article, error)
	// SearchBooks(query, title, author, genre string) ([]model.SimplifiedBook, error)
}
