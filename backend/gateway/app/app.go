package app

import (
	"gateway/controller"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type App struct {
	Routes *gin.Engine
}

func (a *App) CreateRoutes() {
	routes := gin.Default()

	// Book routes
	bookController := controller.NewBookController()
	routes.GET("/books", bookController.GetBook)

	a.Routes = routes
}

func (a *App) Run() {
	a.Routes.Run(":8080")
}
