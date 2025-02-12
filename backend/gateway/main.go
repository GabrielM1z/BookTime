package main

import (
	"bytes"
	"gateway/middleware"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// Fonction pour gérer les requêtes proxy
func proxyRequest(c *fiber.Ctx, targetBaseURL string) error {
	// Construire l'URL cible
	targetURL := targetBaseURL + c.OriginalURL()

	// Créer la requête HTTP
	req, err := http.NewRequest(c.Method(), targetURL, bytes.NewReader(c.Body()))
	if err != nil {
		log.Printf("Erreur lors de la création de la requête proxy : %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create request to target service",
		})
	}

	// Copier les headers de la requête d'origine
	for key, values := range c.GetReqHeaders() {
		req.Header.Set(key, strings.Join(values, ","))
	}

	// Faire la requête HTTP
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Erreur lors de la requête proxy : %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to contact target service",
		})
	}
	defer resp.Body.Close()

	// Lire la réponse
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Erreur lors de la lecture de la réponse : %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to read response from target service",
		})
	}

	// Copier le statut et les headers de la réponse
	c.Status(resp.StatusCode)
	for key, values := range resp.Header {
		for _, value := range values {
			c.Set(key, value)
		}
	}

	return c.Send(body)
}

func main() {
	middleware.InitKeycloak()
	app := fiber.New()

	// Base URL du service Books
	const booksServiceBaseURL = "http://books:8080"
	const newsServiceBaseURL = "http://news:8080"
	const userServiceBaseURL = "http://user:8080"

	// Route service Books uniquement endpoint search sans protection
	app.All("/books/search*", func(c *fiber.Ctx) error {
		return proxyRequest(c, booksServiceBaseURL)
	})
	app.Get("/books/books*", func(c *fiber.Ctx) error {
		return proxyRequest(c, booksServiceBaseURL)
	})

	// Route service Books uniquement endpoint shops sans protection
	app.All("/books/shops*", func(c *fiber.Ctx) error {
		return proxyRequest(c, booksServiceBaseURL)
	})

	// Route service Books
	app.All("/books/*", middleware.KeycloakMiddleware, func(c *fiber.Ctx) error {
		return proxyRequest(c, booksServiceBaseURL)
	})

	// Route service News
	app.All("/news/*", func(c *fiber.Ctx) error {
		return proxyRequest(c, newsServiceBaseURL)
	})

	// Route service Users
	app.All("/users/*", middleware.KeycloakMiddleware, func(c *fiber.Ctx) error {
		return proxyRequest(c, userServiceBaseURL)
	})

	log.Fatal(app.Listen(":8080"))
}
