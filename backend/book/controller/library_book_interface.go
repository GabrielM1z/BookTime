package controller

import "github.com/gin-gonic/gin"

type LibraryBookControllerInterface interface {
	InsertLibraryBook(c *gin.Context)
	GetLibraryBook(c *gin.Context)
}
