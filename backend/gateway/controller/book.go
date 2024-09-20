package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type BookController struct {
}

func NewBookController() *BookController {
	return &BookController{}
}

// GetBook implements BookControllerInterface
func (bc *BookController) GetBook(c *gin.Context) {
	if true {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": "getBook", "msg": "get book successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get book successfully"})
	}
}
