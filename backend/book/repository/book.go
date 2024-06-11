package repository

import (
	"database/sql"
	"log"

	"booktime/model"
)

type BookRepository struct {
	DB *sql.DB
}

func NewBookRepository(db *sql.DB) *BookRepository {
	return &BookRepository{DB: db}
}

func (br *BookRepository) SelectBook() []*model.Book {
	rows, err := br.DB.Query("SELECT id, title, description, id_format, publisher, publication_date, page_number, language, cover_image_url FROM book")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	books := []*model.Book{}
	for rows.Next() {
		var book model.Book
		if err := rows.Scan(&book.IdBook, &book.Title, &book.Description, &book.IdFormat, &book.Publisher, &book.PublicationDate, &book.PageNumber, &book.Language, &book.CoverImageUrl); err != nil {
			log.Fatal(err)
		}
		books = append(books, &book)
	}

	return books
}

func (br *BookRepository) InsertBook(post model.PostBook) bool {
	_, err := br.DB.Exec("INSERT INTO book (title, description, id_format, publisher, publication_date, page_number, language, cover_image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
		post.Title, post.Description, post.IdFormat, post.Publisher, post.PublicationDate, post.PageNumber, post.Language, post.CoverImageUrl)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}
