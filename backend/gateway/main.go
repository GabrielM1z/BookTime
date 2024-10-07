package main

import (
	"gateway/middleware"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	middleware.InitKeycloak()

	app := fiber.New()

	// Route non protégée
	app.Get("/user", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "User data",
		})
	})

	// Route protégée
	app.Get("/books", middleware.KeycloakMiddleware, func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Books data",
		})
	})

	log.Fatal(app.Listen(":8080"))
}