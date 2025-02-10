package app

import (
	"database/sql"
	"fmt"
	"log"

	"user/controller"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type App struct {
	DB     *sql.DB
	Routes *gin.Engine
}

func (a *App) CreateConnection() {

	connStr := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable", "postgres", "postgres123", "postgres", "user_db")
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	a.DB = db
}

func (a *App) CreateRoutes() {
	routes := gin.Default()

	// Load environment variables
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Println("Error loading .env file")
	// }

	prefix := "/users"

	// Users routes
	userController := controller.NewUserController(a.DB)
	routes.GET(prefix+"/users", userController.GetUsers)
	routes.POST(prefix+"/user", userController.InsertUser)
	routes.GET(prefix+"/user/:id", userController.GetUser)
	routes.GET(prefix+"/userfromtoken", userController.GetUserFromToken)
	routes.PUT(prefix+"/user/:id", userController.UpdateUser)
	routes.DELETE(prefix+"/user/:id", userController.DeleteUser)

	a.Routes = routes
}

func (a *App) Run() {
	a.Routes.Run(":8080")
}
