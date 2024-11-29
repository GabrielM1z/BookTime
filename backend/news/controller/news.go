package controller

import (
	"net/http"
	"news/controller/interfaces"
	"news/service"

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

	news, err := nc.NewsService.SearchNews(topic)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, news)
}

var _ interfaces.NewsControllerInterface = &newsController{}
