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
