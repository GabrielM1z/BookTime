package interfaces

import "github.com/gin-gonic/gin"

type AuthorControllerInterface interface {
	InsertAuthor(c *gin.Context)
	GetAuthor(c *gin.Context)
}
