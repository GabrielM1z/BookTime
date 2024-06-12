package interfaces

import "github.com/gin-gonic/gin"

type StateControllerInterface interface {
	InsertState(c *gin.Context)
	GetState(c *gin.Context)
	GetStates(c *gin.Context)
}
