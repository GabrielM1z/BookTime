package model

import (
	"time"

	"github.com/google/uuid"
)

type Action struct {
	IdAction   uuid.UUID `json:"id_action"`
	IdUser     uuid.UUID `json:"id_user"`
	Date       time.Time `json:"date"`
	Type       string    `json:"type"`
	Action     []byte    `json:"read_count"`
	ExecutedBy string    `json:"executed_by"`
}

type PostAction struct {
	IdUser     uuid.UUID `json:"id_user"`
	Date       time.Time `json:"date"`
	Type       string    `json:"type"`
	Action     []byte    `json:"read_count"`
	ExecutedBy string    `json:"executed_by"`
}
