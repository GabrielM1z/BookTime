package model

import "github.com/google/uuid"

type Book struct {
	IdBook          uuid.UUID `json:"id_book"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	ISBN13          string    `json:"isbn13"`
	Format          Format    `json:"format"`
	Publisher       string    `json:"publisher"`
	PublicationDate string    `json:"publication_date"`
	PageNumber      uint      `json:"page_number"`
	Language        string    `json:"language"`
	CoverImageUrl   string    `json:"cover_image_url"`
	Authors         []Author  `json:"authors"`
	Genres          []Genre   `json:"genres"`
}

type PostBook struct {
	Title           string    `json:"title" binding:"required"`
	Description     string    `json:"description"`
	IdFormat        uuid.UUID `json:"id_format"`
	ISBN13          string    `json:"isbn13"`
	Publisher       string    `json:"publisher"`
	PublicationDate string    `json:"publication_date"`
	PageNumber      uint      `json:"page_number"`
	Language        string    `json:"language"`
	CoverImageUrl   string    `json:"cover_image_url"`
}
