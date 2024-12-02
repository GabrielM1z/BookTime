package model

import "github.com/google/uuid"

type LibraryBook struct {
	IdLibrary uuid.UUID `json:"id_library"`
	IdBook    uuid.UUID `json:"id_book"`
}

type PostLibraryBook struct {
	LibraryId uuid.UUID `json:"id_library" binding:"required"`
	BookId    uuid.UUID `json:"id_book" binding:"required"`
}
