package interfaces

import "github.com/gin-gonic/gin"

type FormatControllerInterface interface {
	InsertFormat(c *gin.Context)
	GetFormats(c *gin.Context)
	GetFormat(c *gin.Context)
}
