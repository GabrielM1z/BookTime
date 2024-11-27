package main

import (
	"gateway/middleware"
	"bytes"
	"strings"
	"io"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func main() {
	middleware.InitKeycloak()

	app := fiber.New()

	// Endpoint unique pour toutes les requêtes vers le service Books
	app.All("/books/*", middleware.KeycloakMiddleware, func(c *fiber.Ctx) error {
		// Construire l'URL cible (http://books:8080)
		targetURL := "http://books:8080" + c.OriginalURL()

		// Copier la méthode HTTP et les headers de la requête d'origine
		req, err := http.NewRequest(c.Method(), targetURL, bytes.NewReader(c.Body()))
		if err != nil {
			log.Println("Erreur lors de la création de la requête proxy:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create request to books service",
			})
		}

		// Copier les headers d'origine
		for key, values := range c.GetReqHeaders() {
			req.Header.Set(key, strings.Join(values, ","))
		}

		// Faire la requête vers le service Books
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			log.Println("Erreur lors de la requête proxy:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to contact books service",
			})
		}
		defer resp.Body.Close()

		// Lire la réponse du service Books
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Println("Erreur lors de la lecture de la réponse:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to read response from books service",
			})
		}

		// Copier le statut et les headers de la réponse
		c.Status(resp.StatusCode)
		for key, values := range resp.Header {
			for _, value := range values {
				c.Set(key, value)
			}
		}

		// Envoyer la réponse au client
		return c.Send(body)
	})

	log.Fatal(app.Listen(":8080"))
}
