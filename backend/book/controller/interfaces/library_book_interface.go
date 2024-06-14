package interfaces

import "github.com/gin-gonic/gin"

type LibraryBookControllerInterface interface {
	InsertLibraryBook(c *gin.Context)
	GetAllLibraryBook(c *gin.Context)
	GetLibraryBookByLibraryId(c *gin.Context)
}
