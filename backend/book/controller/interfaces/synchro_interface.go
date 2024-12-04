package interfaces

import "github.com/gin-gonic/gin"

type SynchroControllerInterface interface {
	Synchro(c *gin.Context)
}
