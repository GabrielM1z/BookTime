package app

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"

	"book/controller"
	"book/service"

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
	bookController := controller.NewBookController(a.DB)
	routes.GET("/books", bookController.GetBooks)
	routes.GET("/books/:id", bookController.GetBook)
	routes.POST("/books", bookController.InsertBook)
	routes.PUT("/books/:id", bookController.UpdateBook)
	routes.DELETE("/books/:id", bookController.DeleteBook)

	// Author routes
	authorController := controller.NewAuthorController(a.DB)
	routes.GET("/authors", authorController.GetAuthors)
	routes.GET("/authors/:id", authorController.GetAuthor)
	routes.POST("/authors", authorController.InsertAuthor)
	routes.PUT("/authors/:id", authorController.UpdateAuthor)
	routes.DELETE("/authors/:id", authorController.DeleteAuthor)

	// Format routes
	formatController := controller.NewFormatController(a.DB)
	routes.GET("/formats", formatController.GetFormats)
	routes.GET("/formats/:id", formatController.GetFormat)
	routes.POST("/formats", formatController.InsertFormat)
	routes.PUT("/formats/:id", formatController.UpdateFormat)
	routes.DELETE("/formats/:id", formatController.DeleteFormat)

	// Genre routes
	genreController := controller.NewGenreController(a.DB)
	routes.GET("/genres", genreController.GetGenres)
	routes.GET("/genres/:id", genreController.GetGenre)
	routes.POST("/genres", genreController.InsertGenre)
	routes.PUT("/genres/:id", genreController.UpdateGenre)
	routes.DELETE("/genres/:id", genreController.DeleteGenre)

	// State routes
	stateController := controller.NewStateController(a.DB)
	routes.GET("/states", stateController.GetStates)
	routes.GET("/states/:stateId", stateController.GetState)
	routes.GET("/user/:userId/book/:bookId/states", stateController.GetStateByUserAndBook)
	routes.POST("/states", stateController.InsertState)
	routes.PUT("/states/:stateId", stateController.UpdateState)
	routes.DELETE("/states/:stateId", stateController.DeleteState)

	libraryController := controller.NewLibraryController(a.DB)
	routes.GET("/libraries", libraryController.GetLibraries)
	routes.GET("/libraries/:id", libraryController.GetLibrary)
	routes.GET("/libraries/user/:userId", libraryController.GetLibrariesByUserId)
	routes.POST("/libraries", libraryController.InsertLibrary)
	routes.PUT("/libraries/:id", libraryController.UpdateLibrary)
	routes.DELETE("/libraries/:id", libraryController.DeleteLibrary)

	// LibraryBook routes
	libraryBookController := controller.NewLibraryBookController(a.DB)
	routes.GET("/libraryBook", libraryBookController.GetLibraryBooks)                           // Récupère tous les liens bibliothèque-livre
	routes.POST("/libraryBook", libraryBookController.InsertLibraryBook)                        // Crée un lien
	routes.DELETE("/libraryBook/:id_library/:id_book", libraryBookController.DeleteLibraryBook) // Supprime un lien
	routes.GET("/libraryBook/:libraryId", libraryBookController.GetLibraryBookByLibraryId)

	// SharedLibrary routes
	sharedLibraryController := controller.NewSharedLibraryController(a.DB)
	routes.GET("/shared_libraries", sharedLibraryController.GetSharedLibraries)
	routes.GET("/shared_libraries/:id_user/:id_library", sharedLibraryController.GetSharedLibrary)
	routes.POST("/shared_libraries", sharedLibraryController.InsertSharedLibrary)
	routes.PUT("/shared_libraries/:id_user/:id_library", sharedLibraryController.UpdateSharedLibrary)
	routes.DELETE("/shared_libraries/:id_user/:id_library", sharedLibraryController.DeleteSharedLibrary)

	// Routes BookAuthor
	bookAuthorController := controller.NewBookAuthorController(a.DB)
	routes.GET("/book_authors", bookAuthorController.GetBookAuthors)
	routes.GET("/book_authors/:id_author/:id_book", bookAuthorController.GetBookAuthor)
	routes.POST("/book_authors", bookAuthorController.InsertBookAuthor)
	routes.DELETE("/book_authors/:id_author/:id_book", bookAuthorController.DeleteBookAuthor)

	// Routes BookGenre
	bookGenreController := controller.NewBookGenreController(a.DB)
	routes.GET("/book_genres", bookGenreController.GetBookGenres)
	routes.GET("/book_genres/:id_genre/:id_book", bookGenreController.GetBookGenre)
	routes.POST("/book_genres", bookGenreController.InsertBookGenre)
	routes.DELETE("/book_genres/:id_genre/:id_book", bookGenreController.DeleteBookGenre)

	a.Routes = routes
}

func (a *App) Run() {
	a.Routes.Run(":8083")
}
