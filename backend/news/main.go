package main

import (
	"news/app"
)

func main() {
	var a app.App
	a.CreateRoutes()
	a.Run()
}
