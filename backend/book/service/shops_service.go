package service

import (
	"book/model"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"

	"book/service/interfaces"

	"github.com/gocolly/colly"
)

type ShopsService struct {
	ApiKey string
}

func NewShopsService(apiKey string) *ShopsService {
	return &ShopsService{ApiKey: apiKey}
}

// Recherche sur Google Books
func (ss *ShopsService) fetchGoogleBook(isbn string) (model.BookInfo, error) {
	baseURL := "https://www.googleapis.com/books/v1/volumes"
	params := url.Values{}
	params.Add("q", isbn)
	params.Add("key", ss.ApiKey)
	apiURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	resp, err := http.Get(apiURL)
	if err != nil {
		return model.BookInfo{}, fmt.Errorf("failed to fetch from Google Books: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return model.BookInfo{}, fmt.Errorf("Google Books API returned status: %d", resp.StatusCode)
	}

	var apiResponse struct {
		Items []struct {
			VolumeInfo struct {
				Title               string `json:"title"`
				InfoLink            string `json:"infoLink"`
				IndustryIdentifiers []struct {
					Type       string `json:"type"`
					Identifier string `json:"identifier"`
				} `json:"industryIdentifiers"`
			} `json:"volumeInfo"`
			SaleInfo struct {
				IsEbook   bool `json:"isEbook"`
				ListPrice struct {
					Amount       float64 `json:"amount"`
					CurrencyCode string  `json:"currencyCode"`
				} `json:"listPrice"`
				BuyLink string `json:"buyLink"`
			} `json:"saleInfo"`
		} `json:"items"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return model.BookInfo{}, fmt.Errorf("failed to parse Google Books response: %v", err)
	}

	if len(apiResponse.Items) == 0 {
		return model.BookInfo{Exists: false}, nil
	}

	item := apiResponse.Items[0]

	// Vérifier si le livre est un eBook
	if !item.SaleInfo.IsEbook {
		return model.BookInfo{Exists: false}, nil
	}

	// Construire l'information du livre
	price := ""
	if item.SaleInfo.ListPrice.Amount > 0 {
		price = fmt.Sprintf("%.2f %s", item.SaleInfo.ListPrice.Amount, item.SaleInfo.ListPrice.CurrencyCode)
	}

	return model.BookInfo{
		Title:  item.VolumeInfo.Title,
		Price:  price,
		URL:    item.SaleInfo.BuyLink,
		Exists: true,
		Format: "digital",
	}, nil
}

// Recherche sur Amazon
func (ss *ShopsService) fetchAmazonBook(isbn string) (model.BookInfo, error) {
	c := colly.NewCollector()

	var book model.BookInfo
	book.Exists = false

	// Construire l'URL de recherche
	searchURL := fmt.Sprintf("https://www.amazon.fr/s?k=%s", isbn)

	// Trouver le premier résultat
	c.OnHTML(".s-main-slot .s-result-item", func(e *colly.HTMLElement) {
		if !book.Exists { // Récupérer uniquement le premier résultat
			title := e.ChildText("h2 span")
			price := e.ChildText(".a-price span.a-offscreen")
			link := e.ChildAttr("h2 a", "href")

			if title != "" && link != "" {
				book.Title = title
				book.Price = price
				book.URL = "https://www.amazon.fr" + link
				book.Exists = true
				book.Format = "physical"
			}
		}
	})

	// Gérer les erreurs
	c.OnError(func(r *colly.Response, err error) {
		log.Printf("Error: %v (status code: %d)", err, r.StatusCode)
	})

	// Visiter l'URL de recherche
	err := c.Visit(searchURL)
	if err != nil {
		return model.BookInfo{}, fmt.Errorf("failed to scrape Amazon: %v", err)
	}

	if !book.Exists {
		return model.BookInfo{Exists: false}, nil
	}

	return book, nil
}

// Service principal pour chercher un livre
func (ss *ShopsService) ShopsBooks(isbn string) ([]model.BookInfo, error) {
	var results []model.BookInfo

	// Recherche sur Google Books
	googleBook, err := ss.fetchGoogleBook(isbn)
	if err != nil {
		log.Printf("Error fetching Google Books: %v", err)
	} else if googleBook.Exists {
		results = append(results, googleBook)
	}

	// Recherche sur Amazon
	amazonBook, err := ss.fetchAmazonBook(isbn)
	if err != nil {
		log.Printf("Error fetching Amazon: %v", err)
	} else if amazonBook.Exists {
		results = append(results, amazonBook)
	}

	return results, nil
}

var _ interfaces.ShopsServiceInterface = &ShopsService{}
