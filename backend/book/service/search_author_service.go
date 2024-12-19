package service

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"

	"book/model"
	"book/repository"
	"book/service/interfaces"
)

type SearchAuthorService struct {
	DB *sql.DB
}

func NewSearchAuthorService(db *sql.DB) *SearchAuthorService {
	return &SearchAuthorService{DB: db}
}

func (sas *SearchAuthorService) GetAuthorByName(name string) (*model.Author, error) {
	db := sas.DB
	repoAuthor := repository.NewAuthorRepository(db)
	author, _ := repoAuthor.SelectAuthorByName(name)

	if author == nil {
		foundAuthor, err := sas.SearchAuthor(name)
		if err != nil {
			return nil, fmt.Errorf("Invalid author: %w", err)
		} else {
			repoAuthor.InsertAuthor(foundAuthor)
			author, err = repoAuthor.SelectAuthorByName(foundAuthor.Name)
		}
	}

	return author, nil
}

func (sas *SearchAuthorService) SearchAuthor(name string) (model.PostAuthor, error) {
	name = strings.Replace(name, " ", "_", 100)

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
