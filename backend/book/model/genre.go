package model

import "github.com/google/uuid"

type Genre struct {
	IdGenre uuid.UUID `json:"id_genre"`
	Name    string    `json:"name"`
}

type PostGenre struct {
	Name string `json:"name" binding:"required"`
}
