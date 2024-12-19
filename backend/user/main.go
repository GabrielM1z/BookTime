package main

import (
	"user/app"
)

func main() {
	var a app.App
	a.CreateConnection()
	// a.Migrate()
	a.CreateRoutes()
	a.Run()
}
