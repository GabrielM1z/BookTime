package model

type BookAuthor struct {
	IdAuthor uint `json:"id_author"`
	IdBook   uint `json:"id_book"`
}

type PostBookAuthor struct {
	IdAuthor uint `json:"id_author"`
	IdBook   uint `json:"id_book"`
}
