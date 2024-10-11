package repository

import (
	"database/sql"
	"log"

	"book/model"
)

type LibraryBookRepository struct {
	DB *sql.DB
}

func NewLibraryBookRepository(db *sql.DB) *LibraryBookRepository {
	return &LibraryBookRepository{DB: db}
}

// SelectLibraryBooks - Récupère tous les liens bibliothèque-livre
func (r *LibraryBookRepository) SelectLibraryBooks() []model.LibraryBook {
	var result []model.LibraryBook
	rows, err := r.DB.Query("SELECT * FROM library_book")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var libraryBook model.LibraryBook
		err := rows.Scan(&libraryBook.IdLibrary, &libraryBook.IdBook)
		if err != nil {
			log.Println(err)
		} else {
			result = append(result, libraryBook)
		}
	}
	return result
}

// SelectLibraryBook - Récupère un lien bibliothèque-livre spécifique
func (r *LibraryBookRepository) SelectLibraryBook(idLibrary uint, idBook uint) (model.LibraryBook, error) {
	var libraryBook model.LibraryBook
	stmt, err := r.DB.Prepare("SELECT * FROM library_book WHERE id_library = $1 AND id_book = $2")
	if err != nil {
		log.Println(err)
		return libraryBook, err
	}
	defer stmt.Close()

	row := stmt.QueryRow(idLibrary, idBook)
	err = row.Scan(&libraryBook.IdLibrary, &libraryBook.IdBook)
	if err != nil {
		if err == sql.ErrNoRows {
			return libraryBook, nil // Pas de lien trouvé
		}
		log.Println(err)
		return libraryBook, err
	}

	return libraryBook, nil
}

func (lbr *LibraryBookRepository) SelectLibraryBookByLibrary(idLibrary string) []*model.Book {

	query := `
        SELECT id_book, title, description, id_format, publisher, 
               TO_CHAR(publication_date,'YYYY-MM-DD') as publication_date, page_number, language, cover_image_url
        FROM book
		WHERE id_book IN (SELECT id_book FROM library_book WHERE id_library = $1);`

	rows, err := lbr.DB.Query(query, idLibrary)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	books := []*model.Book{}
	IDFormat := 0

	for rows.Next() {
		var book model.Book
		if err := rows.Scan(&book.IdBook, &book.Title, &book.Description, &IDFormat, &book.Publisher, &book.PublicationDate, &book.PageNumber, &book.Language, &book.CoverImageUrl); err != nil {
			log.Fatal(err)
		}
		format, _ := NewFormatRepository(lbr.DB).SelectFormat(uint(IDFormat))
		book.Format = format
		books = append(books, &book)
	}

	br := NewBookRepository(lbr.DB)

	for _, book := range books {
		book.Authors = br.SelectAuthorsByBookID(book.IdBook)
		book.Genres = br.SelectGenresByBookID(book.IdBook)
	}

	return books
}

// InsertLibraryBook - Insère un lien bibliothèque-livre
func (r *LibraryBookRepository) InsertLibraryBook(post model.PostLibraryBook) bool {
	stmt, err := r.DB.Prepare("INSERT INTO library_book (id_library, id_book) VALUES ($1, $2)")
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

// UpdateLibraryBook - Met à jour un lien bibliothèque-livre
func (r *LibraryBookRepository) UpdateLibraryBook(idLibrary, idBook int, libraryBook model.LibraryBook) bool {
	query := `UPDATE library_book SET id_library = $1, id_book = $2 WHERE id_library = $3 AND id_book = $4`
	_, err := r.DB.Exec(query, libraryBook.IdLibrary, libraryBook.IdBook, idLibrary, idBook)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

// DeleteLibraryBook - Supprime un lien bibliothèque-livre
func (r *LibraryBookRepository) DeleteLibraryBook(idLibrary, idBook int) bool {
	stmt, err := r.DB.Prepare("DELETE FROM library_book WHERE id_library = $1 AND id_book = $2")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()

	_, err2 := stmt.Exec(idLibrary, idBook)
	if err2 != nil {
		log.Println(err2)
		return false
	}
	return true
}
