package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"strings"

	"github.com/golang-jwt/jwt/v4"
)

func getUserID(c *gin.Context) string {
	// Récupérer le jeton d'authentification depuis l'en-tête Authorization
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
		return ""
	}

	// Vérifier si le jeton est de type Bearer
	if !strings.HasPrefix(authHeader, "Bearer ") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
		return ""
	}

	// Extraire le token
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	// Décoder le token sans validation pour extraire les claims (utilisez un clé si nécessaire pour vérifier la signature)
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return ""
	}

	// Convertir les claims en jwt.MapClaims pour extraire "sub"
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return ""
	}

	// Récupérer le champ "sub" (subject)
	sub, ok := claims["sub"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Subject (sub) not found in token"})
		return ""
	}

	return sub
}
