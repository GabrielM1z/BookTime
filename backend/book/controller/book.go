package controller

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"book/controller/interfaces"
	"book/model"
	"book/repository"
	"book/service"

	"github.com/gin-gonic/gin"
)

type BookController struct {
	DB *sql.DB
}

func NewBookController(db *sql.DB) *BookController {
	return &BookController{DB: db}
}

// GetBook implements BookControllerInterface
func (bc *BookController) GetBooks(c *gin.Context) {
	db := bc.DB
	repoBook := repository.NewBookRepository(db)
	getBook := repoBook.SelectBooks()
	if getBook != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getBook, "msg": "get book successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get book successfully"})
	}
}

// LE GET BOOK DOIT MAINTENANT ACCEPTER UN ISBN EN TANT QU'ID => PUIS FAIRE LA RECHERCHE SUR L'API GOOGLE SI LE BOOK NEST PAS PRESENT DANS LA BBD SERVER
func (bc *BookController) GetBook(c *gin.Context) {
	db := bc.DB
	idParam := c.Param("id")

	repoBook := repository.NewBookRepository(db)
	book, err := repoBook.SelectBook(idParam)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve book"})
		return
	}

	//Search the book with ibsn in google book & add it to our database
	if book == nil {
		apiKey := os.Getenv("GOOGLE_BOOKS_API_KEY")
		searchService := service.NewSearchService(apiKey, bc.DB)
		book, err = searchService.SearchBookByISBN(idParam)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		//NEW----------------
		imageURL := book.CoverImageUrl // URL de l'image récupérée
		bookID := idParam              // ID du livre correspondant

		publicURLBase := "http://84.235.239.52:8082/books"
		if os.Getenv("ENVIROMENT") == "development" {
			publicURLBase = "http://localhost:8082/books"
		} else if os.Getenv("ENVIROMENT") == "oracle" {
			publicURLBase = "http://84.235.239.52:8082/books"
		} else if os.Getenv("ENVIROMENT") == "production" {
			publicURLBase = "http://http://159.31.247.130:8082/books"
		}
		// fmt.Println("le publicURLBase est:", publicURLBase)

		ImageService := service.NewImageService("/app/images", publicURLBase) // Crée un service d'images

		// fmt.Println("le imageURL est:", imageURL)

		publicURL, err := ImageService.SaveBookImage(imageURL, bookID) // Enregistre l'image localement et retourne l'URL publique
		if err != nil {
			fmt.Println("Erreur lors de l'enregistrement de l'image:", err)
		} else {
			fmt.Println("Image enregistrée et accessible à :", publicURL)
			book.CoverImageUrl = publicURL
		}
		//NEW----------------

		repoBook.InsertBook(*book)

		//Add new book-author when book is added to bdd
		repoBookAuthor := repository.NewBookAuthorRepository(db)
		for _, author := range book.Authors {
			var bookAuthor = model.BookAuthor{
				IdAuthor: author.IdAuthor,
				IdBook:   book.IdBook,
			}
			repoBookAuthor.InsertBookAuthor(bookAuthor)
		}

	}

	// if errors != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve book"})
	// 	return
	// }

	// if author == nil {
	// 	//il faut ajouter l'auteur en bdd
	// }
	// //il faut faire la liaision entre le livre et

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": book, "msg": "get book successfully"})
}

// InsertBook implements BookControllerInterface
func (bc *BookController) InsertBook(c *gin.Context) {
	db := bc.DB
	var post model.Book
	if err := c.ShouldBindJSON(&post); err == nil {
		repoBook := repository.NewBookRepository(db)
		insert := repoBook.InsertBook(post)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert book successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert book failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}

func (bc *BookController) UpdateBook(c *gin.Context) {
	var book model.Book

	db := bc.DB
	idParam := c.Param("id")
	book.IdBook = idParam

	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	repoBook := repository.NewBookRepository(db)
	success := repoBook.UpdateBook(book)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update book"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Book updated successfully"})
}

func (bc *BookController) DeleteBook(c *gin.Context) {
	db := bc.DB
	idParam := c.Param("id")

	repoBook := repository.NewBookRepository(db)
	success := repoBook.DeleteBook(idParam)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete book"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Book deleted successfully"})
}

var _ interfaces.BookControllerInterface = &BookController{}
