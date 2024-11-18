package repository

import (
	"database/sql"
	"log"

	"book/model"
)

type BookRepository struct {
	DB *sql.DB
}

func NewBookRepository(db *sql.DB) *BookRepository {
	return &BookRepository{DB: db}
}

func (br *BookRepository) SelectBooks() []*model.Book {
	query := `
        SELECT id_book, title, description, id_format, publisher, 
               TO_CHAR(publication_date,'YYYY-MM-DD') as publication_date, page_number, language, cover_image_url
        FROM book;`

	rows, err := br.DB.Query(query)
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
		format, _ := NewFormatRepository(br.DB).SelectFormat(uint(IDFormat))
		book.Format = format
		books = append(books, &book)
	}

	for _, book := range books {
		book.Authors = br.SelectAuthorsByBookID(book.IdBook)
		book.Genres = br.SelectGenresByBookID(book.IdBook)
	}

	return books
}

func (br *BookRepository) SelectAuthorsByBookID(bookID uint) []model.Author {
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

func (br *BookRepository) SelectGenresByBookID(bookID uint) []model.Genre {
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
	_, err := br.DB.Exec("INSERT INTO book (title, description, id_format, publisher, publication_date, page_number, language, cover_image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
		post.Title, post.Description, post.IdFormat, post.Publisher, post.PublicationDate, post.PageNumber, post.Language, post.CoverImageUrl)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (br *BookRepository) SelectBook(id int) (*model.Book, error) {
	query := `
        SELECT id_book, title, description, id_format, publisher, 
               TO_CHAR(publication_date,'YYYY-MM-DD') as publication_date, page_number, language, cover_image_url
        FROM book WHERE id_book = $1`

	row := br.DB.QueryRow(query, id)

	IDFormat := 0

	var book model.Book
	err := row.Scan(&book.IdBook, &book.Title, &book.Description, &IDFormat, &book.Publisher, &book.PublicationDate, &book.PageNumber, &book.Language, &book.CoverImageUrl)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		log.Println(err)
		return nil, err
	}

	format, _ := NewFormatRepository(br.DB).SelectFormat(uint(IDFormat))
	book.Format = format

	book.Authors = br.SelectAuthorsByBookID(book.IdBook)
	book.Genres = br.SelectGenresByBookID(book.IdBook)

	return &book, nil
}

func (br *BookRepository) UpdateBook(id int, book model.Book) bool {
	query := `UPDATE book SET title = $1, description = $2, id_format = $3, publisher = $4, publication_date = $5, 
			  page_number = $6, language = $7, cover_image_url = $8 WHERE id_book = $9`

	_, err := br.DB.Exec(query, book.Title, book.Description, book.Format.IdFormat, book.Publisher, book.PublicationDate,
		book.PageNumber, book.Language, book.CoverImageUrl, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (br *BookRepository) DeleteBook(id int) bool {
	query := "DELETE FROM book WHERE id_book = $1"

	_, err := br.DB.Exec(query, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}
