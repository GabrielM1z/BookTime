package repository

import (
	"database/sql"
	"log"

	"booktime/model"
)

type LibraryBookRepository struct {
	DB *sql.DB
}

func NewLibraryBookRepository(db *sql.DB) LibraryBookRepositoryInterface {
	return &LibraryBookRepository{DB: db}
}

func (lbr *LibraryBookRepository) InsertLibraryBook(post model.PostLibraryBook) bool {
	stmt, err := lbr.DB.Prepare("INSERT INTO library_book (id_library, id_book) VALUES ($1, $2)")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()
	_, err2 := stmt.Exec(post.LibraryId, post.BookId)
	if err2 != nil {
		log.Println(err2)
		return false
	}
	return true
}

func (lbr *LibraryBookRepository) SelectLibraryBook() []model.LibraryBook {
	var result []model.LibraryBook
	rows, err := lbr.DB.Query("SELECT * FROM library_book")
	if err != nil {
		log.Println(err)
		return nil
	}
	for rows.Next() {
		var (
			id        uint
			libraryId uint
			bookId    uint
		)
		err := rows.Scan(&id, &libraryId, &bookId)
		if err != nil {
			log.Println(err)
		} else {
			libraryBook := model.LibraryBook{IdLibrary: libraryId, IdBook: bookId}
			result = append(result, libraryBook)
		}
	}
	return result
}
