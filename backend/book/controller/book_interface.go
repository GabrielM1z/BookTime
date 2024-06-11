package controller

import "github.com/gin-gonic/gin"

type BookControllerInterface interface {
	InsertBook(g *gin.Context)
	GetBook(g *gin.Context)
}
