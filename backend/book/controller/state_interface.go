package controller

import "github.com/gin-gonic/gin"

type StateControllerInterface interface {
	InsertState(c *gin.Context)
	GetState(c *gin.Context)
}