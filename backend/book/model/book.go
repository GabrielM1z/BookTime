package model

type Book struct {
	IdBook          string   `json:"id_book"`
	Title           string   `json:"title"`
	Description     string   `json:"description"`
	Format          string   `json:"format"`
	Publisher       string   `json:"publisher"`
	PublicationDate string   `json:"publication_date"`
	PageNumber      uint     `json:"page_number"`
	Language        string   `json:"language"`
	CoverImageUrl   string   `json:"cover_image_url"`
	Authors         []Author `json:"authors"`
	Genres          []Genre  `json:"genres"`
}

type PostBook struct {
	Title           string `json:"title" binding:"required"`
	Description     string `json:"description"`
	Format          string `json:"id_format"`
	Publisher       string `json:"publisher"`
	PublicationDate string `json:"publication_date"`
	PageNumber      uint   `json:"page_number"`
	Language        string `json:"language"`
	CoverImageUrl   string `json:"cover_image_url"`
}
