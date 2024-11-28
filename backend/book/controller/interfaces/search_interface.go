package interfaces

import "github.com/gin-gonic/gin"

type SearchControllerInterface interface {
	SearchBooks(c *gin.Context)
}
