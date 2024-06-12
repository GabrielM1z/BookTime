package interfaces

import "booktime/model"

type FormatRepositoryInterface interface {
	InsertFormat(post model.PostFormat) bool
	SelectFormat() []model.Format
}
