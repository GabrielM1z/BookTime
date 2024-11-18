package interfaces

import "book/model"

type FormatRepositoryInterface interface {
	InsertFormat(post model.PostFormat) bool
	SelectFormats() []model.Format
	SelectFormat(id uint) (model.Format, error)
	UpdateFormat(id int, format model.Format) bool
	DeleteFormat(id int) bool
}
