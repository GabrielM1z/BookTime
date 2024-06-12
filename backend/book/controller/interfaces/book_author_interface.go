package interfaces

import "github.com/gin-gonic/gin"

type BookAuthorControllerInterface interface {
	InsertBookAuthor(c *gin.Context)
	GetBookAuthor(c *gin.Context)
}
