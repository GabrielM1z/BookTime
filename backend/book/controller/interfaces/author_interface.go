package interfaces

import "github.com/gin-gonic/gin"

type AuthorControllerInterface interface {
	InsertAuthor(c *gin.Context)
	GetAuthor(c *gin.Context)
	UpdateAuthor(c *gin.Context)
	GetAuthorByName(c *gin.Context)
}
