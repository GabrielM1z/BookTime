package interfaces

import "github.com/gin-gonic/gin"

type BookControllerInterface interface {
	InsertBook(c *gin.Context)
	GetBook(c *gin.Context)
}
