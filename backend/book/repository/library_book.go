package repository

import (
	"database/sql"
	"log"

	"book/model"
	"book/repository/interfaces"
)

type LibraryBookRepository struct {
	DB *sql.DB
}

func NewLibraryBookRepository(db *sql.DB) *LibraryBookRepository {
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

func (lbr *LibraryBookRepository) SelectAllLibraryBook() []model.LibraryBook {
	rows, err := lbr.DB.Query("SELECT * FROM library_book")
	if err != nil {
		log.Println(err)
		return nil
	}

	defer rows.Close()
	libraryBooks := []model.LibraryBook{}

	for rows.Next() {
		var libraryBook model.LibraryBook
		if err := rows.Scan(&libraryBook.IdBook, &libraryBook.IdLibrary); err != nil {
			log.Fatal(err)
		}
		libraryBooks = append(libraryBooks, libraryBook)
	}
	return libraryBooks
}

func (lbr *LibraryBookRepository) SelectLibraryBookByLibrary(idLibrary string) []model.Book {
	rows, err := lbr.DB.Query("SELECT * FROM book WHERE id_book IN (SELECT id_book FROM library_book WHERE id_library = $1)", idLibrary)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	books := []model.Book{}
	for rows.Next() {
		var book model.Book
		if err := rows.Scan(&book.IdBook, &book.Title, &book.Description, &book.FormatName, &book.Publisher, &book.PublicationDate, &book.PageNumber, &book.Language, &book.CoverImageUrl); err != nil {
			log.Fatal(err)
		}
		books = append(books, book)
	}
	return books
}

var _ interfaces.LibraryBookRepositoryInterface = &LibraryBookRepository{}
