package app

import (
	"database/sql"
	"fmt"
	"log"

	"booktime/controller"

	"github.com/gin-gonic/gin"
)

type App struct {
	DB     *sql.DB
	Routes *gin.Engine
}

func (a *App) CreateConnection() {
	connStr := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable", UNAMEDB, PASSDB, HOSTDB, DBNAME)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	a.DB = db
}

func (a *App) CreateRoutes() {
	routes := gin.Default()
	controller := controller.NewBookController(a.DB)
	routes.GET("/book", controller.GetBook)
	routes.POST("/book", controller.InsertBook)
	a.Routes = routes
}

func (a *App) Run() {
	a.Routes.Run(":8080")
}
