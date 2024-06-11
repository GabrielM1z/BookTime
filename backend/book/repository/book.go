package repository

import (
	"database/sql"
	"log"

	"booktime/model"
)

type BookRepository struct {
	DB *sql.DB
}

func NewBookRepository(db *sql.DB) BookRepositoryInterface {
	return &BookRepository{DB: db}
}

// InsertBook implements BookRepositoryInterface
func (m *BookRepository) InsertBook(post model.PostBook) bool {
	stmt, err := m.DB.Prepare("INSERT INTO book (title, genre, volumes, chapters, author) VALUES ($1, $2, $3, $4, $5)")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()
	_, err2 := stmt.Exec(post.Title, post.Genre, post.Volumes, post.Chapters, post.Author)
	if err2 != nil {
		log.Println(err2)
		return false
	}
	return true
}

// SelectBook implements BookRepositoryInterface
func (m *BookRepository) SelectBook() []model.Book {
	var result []model.Book
	rows, err := m.DB.Query("SELECT * FROM book")
	if err != nil {
		log.Println(err)
		return nil
	}
	for rows.Next() {
		var (
			id       uint
			title    string
			genre    string
			volumes  uint8
			chapters uint16
			author   string
		)
		err := rows.Scan(&id, &title, &genre, &volumes, &chapters, &author)
		if err != nil {
			log.Println(err)
		} else {
			book := model.Book{Id: id, Title: title, Genre: genre, Volumes: volumes, Chapters: chapters, Author: author}
			result = append(result, book)
		}
	}
	return result
}
