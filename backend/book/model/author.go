package model

import "github.com/google/uuid"

type Author struct {
	IdAuthor    uuid.UUID `json:"id_author"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
}

type PostAuthor struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}
