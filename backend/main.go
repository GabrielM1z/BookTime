package main

import (
	"github.com/GabrielM1z/BookTime/tree/develop/backend/booktime/backend/app"
)

func main() {
	var a app.App
	a.CreateConnection()
	a.Migrate()
	a.CreateRoutes()
	a.Run()
}
