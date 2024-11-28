package interfaces

import "github.com/gin-gonic/gin"

type LibraryControllerInterface interface {
	GetLibraries(c *gin.Context)
	GetLibrary(c *gin.Context)
	GetLibrariesByUserId(c *gin.Context)
	InsertLibrary(c *gin.Context)
	UpdateLibrary(c *gin.Context)
	DeleteLibrary(c *gin.Context)
}
