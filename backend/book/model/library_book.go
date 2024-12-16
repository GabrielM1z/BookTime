package model

import "github.com/google/uuid"

type LibraryBook struct {
	LibraryId uuid.UUID `json:"id_library" binding:"required"`
	IdBook    uuid.UUID `json:"id_book" binding:"required"`
}
