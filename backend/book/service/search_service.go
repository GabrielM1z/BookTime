package service

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strconv"

	"book/model"
	"book/repository"
	"book/service/interfaces"
)

type SearchService struct {
	DB     *sql.DB
	ApiKey string
}

func NewSearchService(apiKey string, db *sql.DB) *SearchService {
	return &SearchService{ApiKey: apiKey, DB: db}
}

// Function to check if a book with the same ID exists
func bookExists(books []model.BookItem, id string) bool {
	for _, book := range books {
		if book.ID == id {
			return true
		}
	}
	return false
}

func (bs *SearchService) SearchBookByISBN(isbn string) (*model.Book, error) {
	db := bs.DB
	baseURL := "https://www.googleapis.com/books/v1/volumes"
	params := url.Values{}

	maxResults := "1"

	params.Add("q", "isbn:"+isbn)
	params.Add("maxResults", maxResults)
	params.Add("key", bs.ApiKey)

	apiURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("API request : ' " + apiURL + " 'failed with status: " + strconv.Itoa(resp.StatusCode))
	}

	var apiResponse model.BookAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, err
	}

	if len(apiResponse.Items) == 0 {
		return nil, fmt.Errorf("no books found for ISBN %s", isbn)
	}
	respBook := apiResponse.Items[0].VolumeInfo

	var book model.Book
	var authors []model.Author
	var genres []model.Genre
	for _, authorName := range respBook.Authors {
		author, err := NewSearchAuthorService(db).GetAuthorByName(authorName)
		if err != nil {
			log.Printf("Error fetching author %s: %v", authorName, err)
			continue
		}
		authors = append(authors, *author)
	}

	for _, genreName := range respBook.Categories {

		var genre model.Genre
		genre, err = repository.NewGenreRepository(bs.DB).SelectGenreByName(genreName)


		if genre.Name == "" {
			repository.NewGenreRepository(bs.DB).InsertGenre(model.PostGenre{Name: genreName})
			genre, err = repository.NewGenreRepository(bs.DB).SelectGenreByName(genreName)
		}
		genres = append(genres, genre)
	}

	book = model.Book{
		IdBook:          isbn,
		Title:           respBook.Title,
		Description:     respBook.Description,
		Format:          "BOOK",
		Publisher:       respBook.Publisher,
		PublicationDate: respBook.PublishedDate,
		PageNumber:      uint(respBook.PageCount),
		Language:        respBook.Language,
		CoverImageUrl:   respBook.ImageLinks.Thumbnail,
		Authors:         authors,
		Genres:          genres,
	}

	return &book, nil
}

func (bs *SearchService) SearchBooks(startIndex, query, title, author, genre string) ([]model.FormattedBookSearch, error) {
	baseURL := "https://www.googleapis.com/books/v1/volumes"
	params := url.Values{}
	searchQuery := query

	if title != "" {
		searchQuery += "+intitle:" + title
	}
	if author != "" {
		searchQuery += "+inauthor:" + author
	}
	if genre != "" {
		searchQuery += "+subject:" + genre
	}

	maxResults := "10"
	fields := "items(volumeInfo/title, volumeInfo/authors, volumeInfo/industryIdentifiers, volumeInfo/imageLinks/thumbnail)"

	params.Add("q", searchQuery)
	params.Add("startIndex", startIndex)
	params.Add("maxResults", maxResults)
	params.Add("fields", fields)
	params.Add("key", bs.ApiKey)

	var formattedBookSearchList []model.FormattedBookSearch

	//Sécurité afin d'éviter une boucle "sans fin", tente 5 fois de récupérer 10 livres
	maxAttempts := 5
	attempts := 0

	for len(formattedBookSearchList) < 10 && attempts < maxAttempts {
		apiURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

		resp, err := http.Get(apiURL)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			return nil, errors.New("API request : ' " + apiURL + " 'failed with status: " + strconv.Itoa(resp.StatusCode))
		}

		var apiResponse model.BookAPIResponse
		if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
			return nil, err
		}

		if len(apiResponse.Items) == 0 {
			break // No more results
		}

		for _, item := range apiResponse.Items {
			var isbn10, isbn13 string
			for _, id := range item.VolumeInfo.IndustryIdentifiers {
				if id.Type == "ISBN_10" {
					isbn10 = id.Identifier
				} else if id.Type == "ISBN_13" {
					isbn13 = id.Identifier
				}
			}

			if isbn10 == "" && isbn13 == "" {
				continue // Skip books without ISBN-10 and ISBN-13
			}

			formattedBookSearch := model.FormattedBookSearch{
				Title:     item.VolumeInfo.Title,
				Authors:   item.VolumeInfo.Authors,
				Thumbnail: item.VolumeInfo.ImageLinks.Thumbnail,
			}

			if isbn13 != "" {
				formattedBookSearch.ISBN13 = isbn13
			} else if isbn10 != "" {
				// Convert ISBN-10 to ISBN-13
				isbn13Converted, err := convertISBN10toISBN13(isbn10)
				if err != nil {
					log.Printf("Error converting ISBN-10 to ISBN-13: %v", err)
					continue
				}
				formattedBookSearch.ISBN13 = isbn13Converted
			}

			formattedBookSearchList = append(formattedBookSearchList, formattedBookSearch)
			if len(formattedBookSearchList) >= 10 {
				break
			}
		}

		// Increment startIndex for the next batch of results
		startIndexInt, err := strconv.Atoi(startIndex)
		if err != nil {
			return nil, err
		}
		startIndexInt += len(apiResponse.Items)
		startIndex = strconv.Itoa(startIndexInt)
		params.Set("startIndex", startIndex)

		attempts++
	}

	return formattedBookSearchList, nil
}

func convertISBN10toISBN13(isbn10 string) (string, error) {
	if len(isbn10) != 10 {
		return "", errors.New("invalid ISBN-10 length")
	}

	prefix := "978"
	isbnBody := isbn10[:9]
	isbn13 := prefix + isbnBody

	// Calculate the check digit for ISBN-13
	sum := 0
	for i, digit := range isbn13 {
		num := int(digit - '0')
		if i%2 == 0 {
			sum += num
		} else {
			sum += num * 3
		}
	}
	checkDigit := (10 - (sum % 10)) % 10

	return isbn13 + strconv.Itoa(checkDigit), nil
}

var _ interfaces.SearchServiceInterface = &SearchService{}
