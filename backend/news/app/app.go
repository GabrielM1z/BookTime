package app

import (
	"log"
	"os"

	"news/controller"
	"news/service"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type App struct {
	Routes *gin.Engine
}

func (a *App) CreateRoutes() {
	routes := gin.Default()

	//Service & Api
	apiKey := os.Getenv("NEWS_API_KEY")
	log.Println("API KEY")
	log.Println(apiKey)
	newsService := service.NewNewsService(apiKey)
	prefix := "/news"

	// Search routes
	searchController := controller.NewNewsController(newsService)
	routes.GET(prefix+"/search", searchController.SearchNews)

	a.Routes = routes
}

func (a *App) Run() {
	a.Routes.Run(":8080")
}
