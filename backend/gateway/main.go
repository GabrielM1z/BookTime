package main

import (
	"gateway/app"
)

func main() {
	var a app.App
	a.CreateRoutes()
	a.Run()
}
