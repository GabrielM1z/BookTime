package interfaces

import "github.com/gin-gonic/gin"

type LibraryControllerInterface interface {
	InsertLibrary(c *gin.Context)
	GetLibrary(c *gin.Context)
}
