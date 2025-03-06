package interfaces

import "news/model"

type NewsServiceInterface interface {
	SearchNews(topic string, language string, sortBy string, pageSize int) ([]model.Article, error)
}
