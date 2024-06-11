package model

type Genre struct {
	IdGenre uint   `json:"id_genre"`
	Name    string `json:"name"`
}

type PostGenre struct {
	Name string `json:"name" binding:"required"`
}
