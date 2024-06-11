package model

import "time"

type Book struct {
	IdBook          uint      `json:"id_book"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	IdFormat        uint      `json:"id_format"`
	Publisher       string    `json:"publisher"`
	PublicationDate time.Time `json:"publication_date"`
	PageNumber      uint      `json:"page_number"`
	Language        string    `json:"language"`
	CoverImageUrl   string    `json:"cover_image_url"`
}

type PostBook struct {
	Title           string    `json:"title" binding:"required"`
	Description     string    `json:"description"`
	IdFormat        uint      `json:"id_format"`
	Publisher       string    `json:"publisher"`
	PublicationDate time.Time `json:"publication_date"`
	PageNumber      uint      `json:"page_number"`
	Language        string    `json:"language"`
	CoverImageUrl   string    `json:"cover_image_url"`
}