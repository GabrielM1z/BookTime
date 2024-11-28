package interfaces

import "github.com/gin-gonic/gin"

type LibraryBookControllerInterface interface {
	GetLibraryBooks(c *gin.Context) // Récupère tous les liens entre bibliothèques et livres
	GetLibraryBook(c *gin.Context)  // Récupère un lien particulier (bibliothèque-livre)
	GetLibraryBookByLibraryId(c *gin.Context)
	InsertLibraryBook(c *gin.Context) // Crée un lien entre une bibliothèque et un livre
	UpdateLibraryBook(c *gin.Context) // Met à jour un lien entre une bibliothèque et un livre
	DeleteLibraryBook(c *gin.Context) // Supprime un lien entre une bibliothèque et un livre
}
