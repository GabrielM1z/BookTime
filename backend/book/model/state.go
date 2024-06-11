package model

import "time"

type State struct {
	IdState       uint      `json:"id_state"`
	State         string    `json:"state"`
	Progression   uint      `json:"progression"`
	ReadCount     uint      `json:"read_count"`
	LastReadDate  time.Time `json:"last_read_date"`
	IdUser        uint      `json:"id_user"`
	IdBook        uint      `json:"id_book"`
	IsAvailable   bool      `json:"is_available"`
}

type PostState struct {
	State         string    `json:"state"`
	Progression   uint      `json:"progression"`
	ReadCount     uint      `json:"read_count"`
	LastReadDate  time.Time `json:"last_read_date"`
	IdUser        uint      `json:"id_user" binding:"required"`
	IdBook        uint      `json:"id_book" binding:"required"`
	IsAvailable   bool      `json:"is_available"`
}
