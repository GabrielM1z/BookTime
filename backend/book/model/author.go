package model

import "github.com/google/uuid"

type Author struct {
	IdAuthor    uuid.UUID   `json:"id_author"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Description string `json:"description"`
}

type PostAuthor struct {
	FirstName   string `json:"first_name" binding:"required"`
	LastName    string `json:"last_name" binding:"required"`
	Description string `json:"description"`
}