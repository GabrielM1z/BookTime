package model

import "github.com/google/uuid"

type BookGenre struct {
	IdGenre uuid.UUID `json:"id_genre"`
	IdBook  uuid.UUID `json:"id_book"`
}

type PostBookGenre struct {
	IdGenre uuid.UUID `json:"id_genre" binding:"required"`
	IdBook  uuid.UUID `json:"id_book" binding:"required"`
}
