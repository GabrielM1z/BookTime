package service

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"booktime/model"
	"booktime/service/interfaces"
)

type SearchService struct {
	ApiKey string
}

func NewSearchService(apiKey string) *SearchService {
	return &SearchService{ApiKey: apiKey}
}

func (bs *SearchService) SearchBooks(query, title, author, genre string) ([]model.SimplifiedBook, error) {
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

	params.Add("q", searchQuery)
	params.Add("key", bs.ApiKey)
	apiURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	var apiResponse model.BookAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, err
	}

	var simplifiedBooks []model.SimplifiedBook
	for _, item := range apiResponse.Items {
		simplifiedBook := model.SimplifiedBook{
			Title:         item.VolumeInfo.Title,
			Authors:       item.VolumeInfo.Authors,
			Categories:    item.VolumeInfo.Categories,
			Publisher:     item.VolumeInfo.Publisher,
			PublishedDate: item.VolumeInfo.PublishedDate,
			Description:   item.VolumeInfo.Description,
			PageCount:     item.VolumeInfo.PageCount,
			Language:      item.VolumeInfo.Language,
			Thumbnail:     item.VolumeInfo.ImageLinks.Thumbnail,
		}

		// Ajouter ISBN10
		for _, id := range item.VolumeInfo.IndustryIdentifiers {
			if id.Type == "ISBN_13" {
				simplifiedBook.ISBN13 = id.Identifier
				break
			}
		}

		simplifiedBooks = append(simplifiedBooks, simplifiedBook)
	}

	return simplifiedBooks, nil
}

var _ interfaces.SearchServiceInterface = &SearchService{}
