package controller

import (
	"net/http"
	"news/controller/interfaces"
	"news/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type newsController struct {
	NewsService *service.NewsService
}

func NewNewsController(NewsService *service.NewsService) *newsController {
	return &newsController{NewsService: NewsService}
}

func (nc *newsController) SearchNews(c *gin.Context) {
	topic := c.Query("topic")
	if topic == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Topic parameter is required"})
		return
	}
	language := c.Query("language")
	if language == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Language parameter is required"})
		return
	}

	sortBy := c.Query("sortBy")
	if sortBy == "" {
		sortBy = "relevancy"
	}

	pageSize, _ := strconv.Atoi(c.Query("pageSize"))
	if pageSize <= 0 {
		pageSize = 20
	}

	news, err := nc.NewsService.SearchNews(topic, language, sortBy, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, news)
}

var _ interfaces.NewsControllerInterface = &newsController{}
