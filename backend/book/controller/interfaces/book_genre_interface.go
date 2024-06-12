package interfaces

import "github.com/gin-gonic/gin"

type BookGenreControllerInterface interface {
	InsertBookGenre(g *gin.Context)
	GetBookGenres(g *gin.Context)
}
