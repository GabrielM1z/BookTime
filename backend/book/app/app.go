package app

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"

	"book/controller"
	"book/service"

	"github.com/gofiber/fiber/v2"

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

	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}

	//Service & Api
	apiKey := os.Getenv("GOOGLE_BOOKS_API_KEY")
	bookService := service.NewSearchService(apiKey)

	// Search routes
	searchController := controller.NewSearchController(bookService)
	routes.GET("/search", searchController.SearchBooks)

	// Book routes
	// bookController := controller.NewBookController(a.DB)
	// routes.GET("/books", bookController.GetBook)
	//routes.POST("/books", bookController.InsertBook)

	app := fiber.New()

	// Routes du service "book"
	app.Get("/books", func(c *fiber.Ctx) error {
		// Logique pour récupérer les livres
		return c.JSON(fiber.Map{
			"message": "Liste des livres",
		})
	})

	app.Post("/books", func(c *fiber.Ctx) error {
		// Logique pour insérer un livre
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Livre inséré",
		})
	})

	// Author routes
	authorController := controller.NewAuthorController(a.DB)
	routes.GET("/authors", authorController.GetAuthor)
	routes.POST("/authors", authorController.InsertAuthor)
	routes.PUT("/authors/:id", authorController.UpdateAuthor)

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
	routes.GET("/states", stateController.GetStates)
	routes.GET("/user/:userId/book/:bookId/states", stateController.GetState)
	routes.POST("/states", stateController.InsertState)

	// Library routes
	libraryController := controller.NewLibraryController(a.DB)
	routes.GET("/libraries", libraryController.GetAllLibraries)
	routes.GET("/user/:userId/libraries", libraryController.GetLibrariesByUserId)
	routes.POST("/libraries", libraryController.InsertLibrary)

	// LibraryBook routes
	libraryBookController := controller.NewLibraryBookController(a.DB)
	routes.GET("/library_books", libraryBookController.GetAllLibraryBook)
	routes.GET("/library/:libraryId/library_books", libraryBookController.GetLibraryBookByLibraryId)
	routes.POST("/library_books", libraryBookController.InsertLibraryBook)

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
	a.Routes.Run(":8083")
}
