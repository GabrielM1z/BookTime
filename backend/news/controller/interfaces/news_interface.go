package interfaces

import "github.com/gin-gonic/gin"

type NewsControllerInterface interface {
	SearchNews(c *gin.Context)
}
