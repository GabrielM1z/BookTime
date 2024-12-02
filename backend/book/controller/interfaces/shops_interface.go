package interfaces

import "github.com/gin-gonic/gin"

type ShopsControllerInterface interface {
	ShopsBooks(c *gin.Context)
}
