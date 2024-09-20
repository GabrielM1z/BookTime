package interfaces

import "book/model"

type FormatRepositoryInterface interface {
	InsertFormat(post model.PostFormat) bool
	SelectFormat() []model.Format
}
