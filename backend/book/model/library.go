package model

import "github.com/google/uuid"

type Library struct {
	IdLibrary uuid.UUID `json:"id_library"`
	Name      string    `json:"name"`
}

type PostLibrary struct {
	Name string `json:"name" binding:"required"`
}
