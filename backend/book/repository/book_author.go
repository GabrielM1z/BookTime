package repository

import (
	"database/sql"
	"log"

	"book/model"
	"book/repository/interfaces"
)

type BookAuthorRepository struct {
	DB *sql.DB
}

func NewBookAuthorRepository(db *sql.DB) *BookAuthorRepository {
	return &BookAuthorRepository{DB: db}
}

func (ar *BookAuthorRepository) InsertBookAuthor(post model.PostBookAuthor) bool {
	stmt, err := ar.DB.Prepare("INSERT INTO book_author (id_author, id_book) VALUES ($1, $2)")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()
	_, err2 := stmt.Exec(post.IdAuthor, post.IdBook)
	if err2 != nil {
		log.Println(err2)
		return false
	}
	return true
}

func (ar *BookAuthorRepository) SelectBookAuthor() []model.BookAuthor {
	var result []model.BookAuthor
	rows, err := ar.DB.Query("SELECT * FROM book_author")
	if err != nil {
		log.Println(err)
		return nil
	}
	for rows.Next() {
		var (
			id_author uint
			id_book   uint
		)
		err := rows.Scan(&id_author, &id_book)
		if err != nil {
			log.Println(err)
		} else {
			book_author := model.BookAuthor{IdAuthor: id_author, IdBook: id_book}
			result = append(result, book_author)
		}
	}
	return result
}

var _ interfaces.BookAuthorRepositoryInterface = &BookAuthorRepository{}
