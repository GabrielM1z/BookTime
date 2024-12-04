package interfaces

import (
	"book/model"

	"github.com/google/uuid"
)

type FormatRepositoryInterface interface {
	InsertFormat(post model.PostFormat) bool
	SelectFormats() []model.Format
	SelectFormat(id uuid.UUID) (model.Format, error)
	UpdateFormat(id uuid.UUID, format model.Format) bool
	DeleteFormat(id uuid.UUID) bool
}
