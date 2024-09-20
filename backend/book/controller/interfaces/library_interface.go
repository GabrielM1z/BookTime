package interfaces

import "github.com/gin-gonic/gin"

type LibraryControllerInterface interface {
	InsertLibrary(c *gin.Context)
	GetAllLibraries(c *gin.Context)
	GetLibrariesByUserId(c *gin.Context)
}
