package controller

import "github.com/gin-gonic/gin"

type FormatControllerInterface interface {
	InsertFormat(c *gin.Context)
	GetFormat(c *gin.Context)
}