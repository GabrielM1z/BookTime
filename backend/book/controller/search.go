package controller

import (
	"net/http"

	"booktime/service"
	"booktime/controller/interfaces"
	"github.com/gin-gonic/gin"
)

type searchController struct {
	SearchService *service.SearchService
}

func NewSearchController(SearchService *service.SearchService) *searchController {
	return &searchController{SearchService: SearchService}
}

func (bc *searchController) SearchBooks(c *gin.Context) {
	query := c.Query("query")
	title := c.Query("title")
	author := c.Query("author")
	genre := c.Query("genre")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Query parameter is required"})
		return
	}

	books, err := bc.SearchService.SearchBooks(query, title, author, genre)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, books)
}

var _ interfaces.SearchControllerInterface = &searchController{}
