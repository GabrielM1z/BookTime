package app

import (
	"database/sql"
	"fmt"
	"log"

	"booktime/controller"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
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

	// Book routes
	bookController := controller.NewBookController(a.DB)
	routes.GET("/books", bookController.GetBook)
	routes.POST("/books", bookController.InsertBook)

	// Author routes
	authorController := controller.NewAuthorController(a.DB)
	routes.GET("/authors", authorController.GetAuthor)
	routes.POST("/authors", authorController.InsertAuthor)

	// Format routes
	formatController := controller.NewFormatController(a.DB)
	routes.GET("/formats", formatController.GetFormat)
	routes.POST("/formats", formatController.InsertFormat)

	// Genre routes
	genreController := controller.NewGenreController(a.DB)
	routes.GET("/genres", genreController.GetGenre)
	routes.POST("/genres", genreController.InsertGenre)

	// State routes
	stateController := controller.NewStateController(a.DB)
	routes.GET("/state", stateController.GetState)
	routes.GET("/states", stateController.GetStates)
	routes.POST("/states", stateController.InsertState)

	// Library routes
	libraryController := controller.NewLibraryController(a.DB)
	routes.GET("/libraries_by_userid", libraryController.GetLibrariesByUserId)
	routes.GET("/libraries", libraryController.GetLibrary)
	routes.POST("/libraries", libraryController.InsertLibrary)

	// LibraryBook routes
	libraryBookController := controller.NewLibraryBookController(a.DB)
	routes.GET("/library_books", libraryBookController.GetLibraryBook)
	routes.POST("/library_books", libraryBookController.InsertLibraryBook)
	routes.GET("/library_books_by_libraryid", libraryController.GetLibrariesByUserId)

	// SharedLibrary routes
	sharedLibraryController := controller.NewSharedLibraryController(a.DB)
	routes.GET("/shared_libraries", sharedLibraryController.GetSharedLibrary)
	routes.POST("/shared_libraries", sharedLibraryController.InsertSharedLibrary)

	// BookAuthor routes
	bookAuthorController := controller.NewBookAuthorController(a.DB)
	routes.GET("/book_author", bookAuthorController.GetBookAuthor)
	routes.POST("/book_author", bookAuthorController.InsertBookAuthor)

	// BookGenre routes
	bookGenreController := controller.NewBookGenreController(a.DB)
	routes.POST("/book_genres", bookGenreController.InsertBookGenre)
	routes.GET("/book_genres", bookGenreController.GetBookGenres)

	a.Routes = routes
}

func (a *App) Run() {
	a.Routes.Run(":8080")
}
