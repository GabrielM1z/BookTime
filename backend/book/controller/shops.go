package controller

import (
	"net/http"

	"book/controller/interfaces"
	"book/service"

	"github.com/gin-gonic/gin"
)

type shopsController struct {
	ShopsService *service.ShopsService
}

func NewShopsController(ShopsService *service.ShopsService) *shopsController {
	return &shopsController{ShopsService: ShopsService}
}

func (bc *shopsController) ShopsBooks(c *gin.Context) {
	isbn := c.Query("isbn")

	if isbn == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ISBN parameter is required"})
		return
	}

	books, err := bc.ShopsService.ShopsBooks(isbn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, books)
}

var _ interfaces.ShopsControllerInterface = &shopsController{}
