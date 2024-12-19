package service

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strconv"

	"book/model"
	"book/service/interfaces"
)

type SearchService struct {
	ApiKey string
}

func NewSearchService(apiKey string) *SearchService {
	return &SearchService{ApiKey: apiKey}
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
