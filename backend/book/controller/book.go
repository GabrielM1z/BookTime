package controller

import (
	"database/sql"
	"net/http"

	"book/controller/interfaces"
	"book/model"
	"book/repository"

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

	if book == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}

	// bookAuthor :=
	// repoAuthor := repository.NewAuthorRepository(db)
	// author, errors := repoAuthor.SelectAuthorByName(bookAuthor)

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
	var post model.PostBook
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
