package repository

import (
	"database/sql"
	"log"

	"book/model"

	"github.com/google/uuid"
)

type BookRepository struct {
	DB *sql.DB
}

func NewBookRepository(db *sql.DB) *BookRepository {
	return &BookRepository{DB: db}
}

func (br *BookRepository) SelectBooks() []*model.Book {
	query := `
        SELECT id_book, title, description, isbn13, id_format, publisher, 
               TO_CHAR(publication_date,'YYYY-MM-DD') as publication_date, page_number, language, cover_image_url
        FROM book;`

	rows, err := br.DB.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	books := []*model.Book{}
	IDFormat := uuid.New()

	for rows.Next() {
		var book model.Book
		if err := rows.Scan(&book.IdBook, &book.Title, &book.Description, &book.ISBN13, &IDFormat, &book.Publisher, &book.PublicationDate, &book.PageNumber, &book.Language, &book.CoverImageUrl); err != nil {
			log.Fatal(err)
		}
		format, _ := NewFormatRepository(br.DB).SelectFormat(IDFormat)
		book.Format = format
		books = append(books, &book)
	}

	for _, book := range books {
		book.Authors = br.SelectAuthorsByBookID(book.IdBook)
		book.Genres = br.SelectGenresByBookID(book.IdBook)
	}

	return books
}

func (br *BookRepository) SelectAuthorsByBookID(bookID uuid.UUID) []model.Author {
	query := `
		SELECT a.id_author, a.first_name, a.last_name, a.description as author_desc
		FROM author a
		JOIN book_author ba ON a.id_author = ba.id_author
		WHERE ba.id_book = $1;`

	rows, err := br.DB.Query(query, bookID)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	authors := []model.Author{}
	for rows.Next() {
		var author model.Author
		if err := rows.Scan(&author.IdAuthor, &author.FirstName, &author.LastName, &author.Description); err != nil {
			log.Fatal(err)
		}
		authors = append(authors, author)
	}

	return authors
}

func (br *BookRepository) SelectGenresByBookID(bookID uuid.UUID) []model.Genre {
	query := `
        SELECT g.id_genre, g.name as genre_name
        FROM genre g
        JOIN book_genre bg ON g.id_genre = bg.id_genre
        WHERE bg.id_book = $1;    `

	rows, err := br.DB.Query(query, bookID)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	genres := []model.Genre{}
	for rows.Next() {
		var genre model.Genre
		if err := rows.Scan(&genre.IdGenre, &genre.Name); err != nil {
			log.Fatal(err)
		}
		genres = append(genres, genre)
	}

	return genres
}

func (br *BookRepository) InsertBook(post model.PostBook) bool {
	_, err := br.DB.Exec("INSERT INTO book (title, description, isbn13, id_format, publisher, publication_date, page_number, language, cover_image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
		post.Title, post.Description, post.ISBN13, post.IdFormat, post.Publisher, post.PublicationDate, post.PageNumber, post.Language, post.CoverImageUrl)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (br *BookRepository) SelectBook(id uuid.UUID) (*model.Book, error) {
	query := `
        SELECT id_book, title, description, isbn13, id_format, publisher, 
               TO_CHAR(publication_date,'YYYY-MM-DD') as publication_date, page_number, language, cover_image_url
        FROM book WHERE id_book = $1`

	row := br.DB.QueryRow(query, id)

	IDFormat := uuid.New()

	var book model.Book
	err := row.Scan(&book.IdBook, &book.Title, &book.Description, &book.ISBN13, &IDFormat, &book.Publisher, &book.PublicationDate, &book.PageNumber, &book.Language, &book.CoverImageUrl)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		log.Println(err)
		return nil, err
	}

	format, _ := NewFormatRepository(br.DB).SelectFormat(IDFormat)
	book.Format = format

	book.Authors = br.SelectAuthorsByBookID(book.IdBook)
	book.Genres = br.SelectGenresByBookID(book.IdBook)

	return &book, nil
}

func (br *BookRepository) UpdateBook(id uuid.UUID, book model.Book) bool {
	query := `UPDATE book SET title = $1, description = $2, isbn13 = $3, id_format = $4, publisher = $5, publication_date = $6, 
			  page_number = $7, language = $8, cover_image_url = $9 WHERE id_book = $10`

	_, err := br.DB.Exec(query, book.Title, book.Description, book.ISBN13, book.Format.IdFormat, book.Publisher, book.PublicationDate,
		book.PageNumber, book.Language, book.CoverImageUrl, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (br *BookRepository) DeleteBook(id uuid.UUID) bool {
	query := "DELETE FROM book WHERE id_book = $1"

	_, err := br.DB.Exec(query, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}
