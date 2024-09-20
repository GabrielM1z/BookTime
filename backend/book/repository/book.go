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

func (br *BookRepository) SelectBook() []*model.Book {
	query := `
        SELECT b.id_book, b.title, b.description, f.name as format_name, b.publisher, 
               TO_CHAR(b.publication_date,'YYYY-MM-DD') as publication_date, b.page_number, b.language, b.cover_image_url
        FROM book b
        JOIN formats f ON b.id_format = f.id_format
        ORDER BY b.id_book;`

	rows, err := br.DB.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	books := []*model.Book{}
	for rows.Next() {
		var book model.Book
		if err := rows.Scan(&book.IdBook, &book.Title, &book.Description, &book.FormatName, &book.Publisher, &book.PublicationDate, &book.PageNumber, &book.Language, &book.CoverImageUrl); err != nil {
			log.Fatal(err)
		}
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
