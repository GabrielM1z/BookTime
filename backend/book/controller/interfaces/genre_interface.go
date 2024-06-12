package interfaces

import "github.com/gin-gonic/gin"

type GenreControllerInterface interface {
	InsertGenre(c *gin.Context)
	GetGenre(c *gin.Context)
}
