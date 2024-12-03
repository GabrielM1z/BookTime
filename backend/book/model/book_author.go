package model

import "github.com/google/uuid"

type BookAuthor struct {
	IdAuthor uuid.UUID `json:"id_author"`
	IdBook   uuid.UUID `json:"id_book"`
}

type PostBookAuthor struct {
	IdAuthor uuid.UUID `json:"id_author"`
	IdBook   uuid.UUID `json:"id_book"`
}
