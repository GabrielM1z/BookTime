package service

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"

	"book/model"
	"book/service/interfaces"
)

type SearchAuthorService struct {
}

func NewSearchAuthorService() *SearchAuthorService {
	return &SearchAuthorService{}
}

func (sas *SearchAuthorService) SearchAuthor(name string) (model.PostAuthor, error) {
	baseURL := "https://fr.wikipedia.org/w/api.php"
	params := url.Values{}
	params.Add("action", "query")
	params.Add("prop", "extracts")
	params.Add("titles", name)
	params.Add("format", "json")
	params.Add("exintro", "true")
	params.Add("explaintext", "true")

	// Construire l'URL
	requestURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	var author model.PostAuthor

	author.Name = name

	// Faire la requête HTTP
	resp, err := http.Get(requestURL)
	if err != nil {
		fmt.Println("Erreur lors de la requête :", err)
		return author, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Erreur lors de la lecture de la réponse :", err)
		return author, err
	}

	// Décoder la réponse JSON
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		fmt.Println("Erreur lors de l'analyse JSON :", err)
		return author, err
	}

	query := result["query"].(map[string]interface{}) // Accéder à "query"
	pages := query["pages"].(map[string]interface{})  // Accéder à "pages"
	for _, page := range pages {                      // Parcourir les pages
		pageMap := page.(map[string]interface{}) // Convertir en map
		if pageMap["extract"] != nil {
			extract := pageMap["extract"].(string) // Récupérer "extract"
			author.Description = extract
		}
	}

	return author, nil
}

var _ interfaces.SearchAuthorServiceInterface = &SearchAuthorService{}
