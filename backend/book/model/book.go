package model

import "github.com/google/uuid"

type Book struct {
	IdBook          string   `json:"id_book"`
	Title           string   `json:"title"`
	Description     string   `json:"description"`
	Format          Format   `json:"format"`
	Publisher       string   `json:"publisher"`
	PublicationDate string   `json:"publication_date"`
	PageNumber      uint     `json:"page_number"`
	Language        string   `json:"language"`
	CoverImageUrl   string   `json:"cover_image_url"`
	Authors         []Author `json:"authors"`
	Genres          []Genre  `json:"genres"`
}

type PostBook struct {
	Title           string    `json:"title" binding:"required"`
	Description     string    `json:"description"`
	IdFormat        uuid.UUID `json:"id_format"`
	Publisher       string    `json:"publisher"`
	PublicationDate string    `json:"publication_date"`
	PageNumber      uint      `json:"page_number"`
	Language        string    `json:"language"`
	CoverImageUrl   string    `json:"cover_image_url"`
}
