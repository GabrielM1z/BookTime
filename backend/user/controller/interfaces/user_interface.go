package interfaces

import "github.com/gin-gonic/gin"

type UserControllerInterface interface {
	InsertUser(c *gin.Context)
	GetUser(c *gin.Context)
	DeleteUser(c *gin.Context)
}
