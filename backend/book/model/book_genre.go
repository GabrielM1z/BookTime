package model

type BookGenre struct {
	IdGenre uint `json:"id_genre"`
	IdBook  uint `json:"id_book"`
}

type PostBookGenre struct {
	IdGenre uint `json:"id_genre" binding:"required"`
	IdBook  uint `json:"id_book" binding:"required"`
}
