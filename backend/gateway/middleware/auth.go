package middleware

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/oauth2"
	"github.com/joho/godotenv"
)

// Configuration de Keycloak
var (
    keycloakIssuer = "http://keycloak:8080/realms/booktime"
    clientID       = "gateway-client"
    verifier       *oidc.IDTokenVerifier
    oauth2Config   oauth2.Config
)

func InitKeycloak() {
	godotenv.Load(".env")
	clientSecret := os.Getenv("KEYCLOAK_CLIENT_SECRET")
	
	// Initialiser le fournisseur OIDC
	ctx := context.Background()
	provider, err := oidc.NewProvider(ctx, keycloakIssuer)
	if err != nil {
		log.Fatalf("Erreur lors de la connexion à Keycloak: %v", err)
	}

	// Configurer la vérification du token
	verifier = provider.Verifier(&oidc.Config{ClientID: clientID})

	// Configurer l'OAuth2
	oauth2Config = oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		Endpoint:     provider.Endpoint(),
	}
}

func KeycloakMiddleware(c *fiber.Ctx) error {
	log.Println("Vérification du token...")

	// Récupérer le token depuis l'en-tête Authorization
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Authorization header missing",
		})
	}
	token := authHeader[len("Bearer "):]

	// Vérifier le token avec Keycloak
	ctx := context.Background()
	idToken, err := verifier.Verify(ctx, token)
	if err != nil {
		log.Printf("Erreur de vérification du token: %v", err)
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token",
		})
	}

	// Extraire les claims
	var claims map[string]interface{}
	if err := idToken.Claims(&claims); err != nil {
		log.Printf("Erreur lors de l'extraction des claims: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Unable to extract claims",
		})
	}

	// Passer les claims dans le contexte pour les routes
	c.Locals("user", claims)

	return c.Next()
}
