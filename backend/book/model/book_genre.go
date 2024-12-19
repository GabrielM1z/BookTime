package model

import "github.com/google/uuid"

type BookGenre struct {
	IdGenre uuid.UUID `json:"id_genre" binding:"required"`
	IdBook  string `json:"id_book" binding:"required"`
}
