package model

import "github.com/google/uuid"

type State struct {
	State        string    `json:"state"`
	Progression  uint      `json:"progression"`
	ReadCount    uint      `json:"read_count"`
	LastReadDate string    `json:"last_read_date"`
	IdUser       uuid.UUID `json:"id_user"`
	IdBook       string    `json:"id_book" binding:"required"`
	IsAvailable  bool      `json:"is_available"`
}
