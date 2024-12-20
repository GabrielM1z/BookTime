package app

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	// "github.com/joho/godotenv"

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

	connStr := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable", "postgres", "postgres123", "postgres", "book_db")
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

	//Service & Api
	apiKey := os.Getenv("GOOGLE_BOOKS_API_KEY")
	bookSearchService := service.NewSearchService(apiKey, a.DB)
	//bookSearchAuthorService := service.NewSearchAuthorService(a.DB)
	bookShopsService := service.NewShopsService(apiKey)
	bookSynchroService := service.NewSynchroService(a.DB)
	prefix := "/books"

	// Search routes
	searchController := controller.NewSearchController(bookSearchService)
	routes.GET(prefix+"/search", searchController.SearchBooks)

	// Shops routes
	shopsController := controller.NewShopsController(bookShopsService)
	routes.GET(prefix+"/shops", shopsController.ShopsBooks)

	// Synchro routes
	synchroController := controller.NewSynchroController(bookSynchroService)
	routes.POST(prefix+"/synchro/:lastSyncDate", synchroController.Synchro)

	// Book routes
	bookController := controller.NewBookController(a.DB)
	routes.GET(prefix+"/books", bookController.GetBooks)
	routes.GET(prefix+"/books/:id", bookController.GetBook)
	routes.POST(prefix+"/books", bookController.InsertBook)
	routes.PUT(prefix+"/books/:id", bookController.UpdateBook)
	routes.DELETE(prefix+"/books/:id", bookController.DeleteBook)

	// Author routes
	authorController := controller.NewAuthorController(a.DB)
	routes.GET(prefix+"/authors", authorController.GetAuthors)
	routes.GET(prefix+"/authors/:id", authorController.GetAuthor)
	routes.GET(prefix+"/authors/name/:name", authorController.GetAuthorByName)
	routes.POST(prefix+"/authors", authorController.InsertAuthor)
	routes.PUT(prefix+"/authors/:id", authorController.UpdateAuthor)
	routes.DELETE(prefix+"/authors/:id", authorController.DeleteAuthor)

	// Format routes
	formatController := controller.NewFormatController(a.DB)
	routes.GET(prefix+"/formats", formatController.GetFormats)
	routes.GET(prefix+"/formats/:id", formatController.GetFormat)
	routes.POST(prefix+"/formats", formatController.InsertFormat)
	routes.PUT(prefix+"/formats/:id", formatController.UpdateFormat)
	routes.DELETE(prefix+"/formats/:id", formatController.DeleteFormat)

	// Genre routes
	genreController := controller.NewGenreController(a.DB)
	routes.GET(prefix+"/genres", genreController.GetGenres)
	routes.GET(prefix+"/genres/name/:name", genreController.GetGenreByName)
	routes.GET(prefix+"/genres/:id", genreController.GetGenre)
	routes.POST(prefix+"/genres", genreController.InsertGenre)
	routes.PUT(prefix+"/genres/:id", genreController.UpdateGenre)
	routes.DELETE(prefix+"/genres/:id", genreController.DeleteGenre)

	// State routes
	stateController := controller.NewStateController(a.DB)
	routes.GET(prefix+"/states", stateController.GetStates)
	//routes.GET(prefix+"/states/:stateId", stateController.GetState)
	//routes.GET(prefix+"/user/:userId/book/:bookId/states", stateController.GetStateByUserAndBook)
	routes.GET(prefix+"/states/book", stateController.GetStateByUserAndBook)
	routes.POST(prefix+"/states", stateController.InsertState)
	routes.PUT(prefix+"/states/:bookId", stateController.UpdateState)
	routes.DELETE(prefix+"/states/:bookId", stateController.DeleteState)

	libraryController := controller.NewLibraryController(a.DB)
	routes.GET(prefix+"/libraries", libraryController.GetLibraries)
	routes.GET(prefix+"/libraries/:id", libraryController.GetLibrary)
	//routes.GET(prefix+"/libraries/user/:userId", libraryController.GetLibrariesByUserId)
	routes.GET(prefix+"/libraries/user", libraryController.GetLibrariesByUserId)
	routes.POST(prefix+"/libraries", libraryController.InsertLibrary)
	routes.PUT(prefix+"/libraries/:id", libraryController.UpdateLibrary)
	routes.DELETE(prefix+"/libraries/:id", libraryController.DeleteLibrary)

	// LibraryBook routes
	libraryBookController := controller.NewLibraryBookController(a.DB)
	routes.GET(prefix+"/libraryBook", libraryBookController.GetLibraryBooks)                           // Récupère tous les liens bibliothèque-livre
	routes.POST(prefix+"/libraryBook", libraryBookController.InsertLibraryBook)                        // Crée un lien
	routes.DELETE(prefix+"/libraryBook/:id_library/:id_book", libraryBookController.DeleteLibraryBook) // Supprime un lien
	routes.GET(prefix+"/libraryBook/:libraryId", libraryBookController.GetLibraryBookByLibraryId)

	// SharedLibrary routes
	sharedLibraryController := controller.NewSharedLibraryController(a.DB)
	routes.GET(prefix+"/shared_libraries", sharedLibraryController.GetSharedLibraries)
	//routes.GET(prefix+"/shared_libraries/:id_user/:id_library", sharedLibraryController.GetSharedLibrary)
	routes.GET(prefix+"/shared_libraries/:id_library", sharedLibraryController.GetSharedLibrary)
	routes.POST(prefix+"/shared_libraries", sharedLibraryController.InsertSharedLibrary)
	//routes.PUT(prefix+"/shared_libraries/:id_user/:id_library", sharedLibraryController.UpdateSharedLibrary)
	routes.PUT(prefix+"/shared_libraries/:id_library", sharedLibraryController.UpdateSharedLibrary)
	//routes.DELETE(prefix+"/shared_libraries/:id_user/:id_library", sharedLibraryController.DeleteSharedLibrary)
	routes.DELETE(prefix+"/shared_libraries/:id_library", sharedLibraryController.DeleteSharedLibrary)

	// Routes BookAuthor
	bookAuthorController := controller.NewBookAuthorController(a.DB)
	routes.GET(prefix+"/book_authors", bookAuthorController.GetBookAuthors)
	routes.GET(prefix+"/book_authors/:id_author/:id_book", bookAuthorController.GetBookAuthor)
	routes.POST(prefix+"/book_authors", bookAuthorController.InsertBookAuthor)
	routes.DELETE(prefix+"/book_authors/:id_author/:id_book", bookAuthorController.DeleteBookAuthor)

	// Routes BookGenre
	bookGenreController := controller.NewBookGenreController(a.DB)
	routes.GET(prefix+"/book_genres", bookGenreController.GetBookGenres)
	routes.GET(prefix+"/book_genres/:id_genre/:id_book", bookGenreController.GetBookGenre)
	routes.POST(prefix+"/book_genres", bookGenreController.InsertBookGenre)
	routes.DELETE(prefix+"/book_genres/:id_genre/:id_book", bookGenreController.DeleteBookGenre)

	a.Routes = routes
}

func (a *App) Run() {
	a.Routes.Run(":8080")
}
