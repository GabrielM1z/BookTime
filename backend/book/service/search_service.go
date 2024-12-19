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
	//var genres []model.Genre
	for _, authorName := range respBook.Authors {
		author, err := NewSearchAuthorService(db).GetAuthorByName(authorName)
		if err != nil {
			log.Printf("Error fetching author %s: %v", authorName, err)
			continue
		}
		authors = append(authors, *author)
	}
	// for _, genre := range apiResponse.Categories {

	// }
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
		// Categories:      item.VolumeInfo.Categories,
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

	apiURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("API request : ' " + apiURL + " 'failed with status: " + strconv.Itoa(resp.StatusCode))

		// return nil, fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	var apiResponse model.BookAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, err
	}

	var formattedBookSearchList []model.FormattedBookSearch
	for _, item := range apiResponse.Items {
		formattedBookSearch := model.FormattedBookSearch{
			Title:     item.VolumeInfo.Title,
			Authors:   item.VolumeInfo.Authors,
			Thumbnail: item.VolumeInfo.ImageLinks.Thumbnail,
		}

		// Ajouter ISBN10
		for _, id := range item.VolumeInfo.IndustryIdentifiers {
			if id.Type == "ISBN_13" {
				formattedBookSearch.ISBN13 = id.Identifier
				break
			}
		}

		formattedBookSearchList = append(formattedBookSearchList, formattedBookSearch)
	}

	return formattedBookSearchList, nil
}

var _ interfaces.SearchServiceInterface = &SearchService{}
