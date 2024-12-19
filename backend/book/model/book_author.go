package model

import "github.com/google/uuid"

type BookAuthor struct {
	IdAuthor uuid.UUID `json:"id_author"`
	IdBook   string    `json:"id_book"`
}
