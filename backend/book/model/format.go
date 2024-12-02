package model

import "github.com/google/uuid"

type Format struct {
	IdFormat uuid.UUID `json:"id_format"`
	Name     string    `json:"name"`
}

type PostFormat struct {
	Name string `json:"name" binding:"required"`
}
