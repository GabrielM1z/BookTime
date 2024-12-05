package service

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sync"

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

func convertImageToBase64(imageLink string) (string, error) {
	// Faire une requête HTTP pour récupérer l'image
	resp, err := http.Get(imageLink)
	if err != nil {
		fmt.Println("Erreur lors de la récupération de l'image:", err)
		return "", err
	}
	defer resp.Body.Close()

	// Vérifier le statut de la réponse
	if resp.StatusCode != http.StatusOK {
		fmt.Printf("Erreur: statut HTTP %d\n", resp.StatusCode)
		return "", err
	}

	// Lire les données de l'image dans un buffer
	var imgBuffer bytes.Buffer
	_, err = io.Copy(&imgBuffer, resp.Body)
	if err != nil {
		fmt.Println("Erreur lors de la copie des données:", err)
		return "", err
	}

	// Convertir les données en base64
	imgBase64 := base64.StdEncoding.EncodeToString(imgBuffer.Bytes())

	return imgBase64, nil

}

// func (bs *SearchService) SearchBooks(startIndex, query, title, author, genre string) ([]model.SimplifiedBook, error) {
// 	baseURL := "https://www.googleapis.com/books/v1/volumes?"
// 	params := url.Values{}
// 	searchQuery := query

// 	if title != "" {
// 		searchQuery += "+intitle:" + title
// 	}
// 	if author != "" {
// 		searchQuery += "+inauthor:" + author
// 	}
// 	if genre != "" {
// 		searchQuery += "+subject:" + genre
// 	}

// 	maxResults := "10"

// 	params.Add("q", searchQuery)
// 	params.Add("startIndex", startIndex)
// 	params.Add("maxResults", maxResults)
// 	params.Add("key", bs.ApiKey)
// 	apiURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

// 	resp, err := http.Get(apiURL)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer resp.Body.Close()

// 	if resp.StatusCode != http.StatusOK {
// 		return nil, fmt.Errorf("API request failed with status: %d", resp.StatusCode)
// 	}

// 	var apiResponse model.BookAPIResponse
// 	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
// 		return nil, err
// 	}

// 	var simplifiedBooks []model.SimplifiedBook
// 	for _, item := range apiResponse.Items {
// 		simplifiedBook := model.SimplifiedBook{
// 			Title:         item.VolumeInfo.Title,
// 			Authors:       item.VolumeInfo.Authors,
// 			Categories:    item.VolumeInfo.Categories,
// 			Publisher:     item.VolumeInfo.Publisher,
// 			PublishedDate: item.VolumeInfo.PublishedDate,
// 			Description:   item.VolumeInfo.Description,
// 			PageCount:     item.VolumeInfo.PageCount,
// 			Language:      item.VolumeInfo.Language,
// 			Thumbnail:     item.VolumeInfo.ImageLinks.Thumbnail,
// 		}

// 		// Ajouter ISBN10
// 		for _, id := range item.VolumeInfo.IndustryIdentifiers {
// 			if id.Type == "ISBN_13" {
// 				simplifiedBook.ISBN13 = id.Identifier
// 				break
// 			}
// 		}

// 		simplifiedBook.Thumbnail, err = convertImageToBase64(simplifiedBook.Thumbnail)

// 		if err != nil {
// 			simplifiedBook.Thumbnail = ""
// 		}

// 		// if bookExists(simplifiedBooks, item.ID) {

// 		// }
// 		simplifiedBooks = append(simplifiedBooks, simplifiedBook)
// 	}

// 	return simplifiedBooks, nil
// }

func (bs *SearchService) SearchBooks(startIndex, query, title, author, genre string) ([]model.SimplifiedBook, error) {
	baseURL := "https://www.googleapis.com/books/v1/volumes?"
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

	params.Add("q", searchQuery)
	params.Add("startIndex", startIndex)
	params.Add("maxResults", maxResults)
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
	var wg sync.WaitGroup
	errorChan := make(chan error, len(apiResponse.Items)) // Canal pour gérer les erreurs
	done := make(chan struct{})                           // Canal pour signaler la fin
	mutex := &sync.Mutex{}                                // Mutex pour protéger l'accès à `simplifiedBooks`

	for _, item := range apiResponse.Items {
		wg.Add(1)
		go func(item model.BookItem) {
			defer wg.Done()

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

			// Ajouter ISBN13
			for _, id := range item.VolumeInfo.IndustryIdentifiers {
				if id.Type == "ISBN_13" {
					simplifiedBook.ISBN13 = id.Identifier
					break
				}
			}

			// Télécharger l'image et convertir en base64
			base64Image, err := convertImageToBase64(simplifiedBook.Thumbnail)
			if err != nil {
				errorChan <- fmt.Errorf("Erreur pour %s: %v", simplifiedBook.Title, err)
				return
			}
			simplifiedBook.Thumbnail = base64Image

			// Ajouter le livre à la liste de manière thread-safe
			mutex.Lock()
			simplifiedBooks = append(simplifiedBooks, simplifiedBook)
			mutex.Unlock()
		}(item)
	}

	// Fermer le canal d'erreur quand toutes les goroutines sont terminées
	go func() {
		wg.Wait()
		close(done)
	}()

	// Attendre la fin ou une erreur
	select {
	case <-done:
		close(errorChan)
		return simplifiedBooks, nil
	case err := <-errorChan:
		close(errorChan)
		return nil, err
	}
}

var _ interfaces.SearchServiceInterface = &SearchService{}
