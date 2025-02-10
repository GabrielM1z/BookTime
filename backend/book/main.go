package main

import (
	"book/app"
	"io"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {

	f, _ := os.Create("gin.log")
	gin.DefaultWriter = io.MultiWriter(f)

	var a app.App
	a.CreateConnection()
	// a.Migrate()
	a.CreateRoutes()
	a.Run()
}
