package service

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"news/model"
	"news/service/interfaces"
)

type NewsService struct {
	ApiKey string
}

func NewNewsService(apiKey string) *NewsService {
	return &NewsService{ApiKey: apiKey}
}

func (ns *NewsService) SearchNews(topic string, language string) ([]model.Article, error) {
	baseURL := "https://newsapi.org/v2/everything"

	// Préparation des paramètres de la requête
	params := url.Values{}
	params.Add("q", topic)
	params.Add("language", language)
	params.Add("sortBy", "publishedAt")
	params.Add("apiKey", ns.ApiKey)

	// Construction de l'URL finale
	apiURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	// Envoi de la requête
	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Vérification du statut HTTP
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %d .\n to this request : %s.\n from this apikey : %s", resp.StatusCode, apiURL, ns.ApiKey)
	}

	// Décodage de la réponse JSON
	var newsResponse model.NewsResponse
	if err := json.NewDecoder(resp.Body).Decode(&newsResponse); err != nil {
		return nil, err
	}

	// Vérification du statut de l'API
	if newsResponse.Status != "ok" {
		return nil, fmt.Errorf("API returned status: %s", newsResponse.Status)
	}

	return newsResponse.Articles, nil
}

var _ interfaces.NewsServiceInterface = &NewsService{}
