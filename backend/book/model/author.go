package model

type Author struct {
	IdAuthor    uint   `json:"id_author"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Description string `json:"description"`
}

type PostAuthor struct {
	FirstName   string `json:"first_name" binding:"required"`
	LastName    string `json:"last_name" binding:"required"`
	Description string `json:"description"`
}