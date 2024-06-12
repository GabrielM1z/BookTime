package controller

import (
	"database/sql"
	"net/http"

	"booktime/model"
	"booktime/repository"
	"booktime/controller/interfaces"

	"github.com/gin-gonic/gin"
)

type BookController struct {
	DB *sql.DB
}

func NewBookController(db *sql.DB) *BookController {
	return &BookController{DB: db}
}

// GetBook implements BookControllerInterface
func (bc *BookController) GetBook(c *gin.Context) {
	db := bc.DB
	repoBook := repository.NewBookRepository(db)
	getBook := repoBook.SelectBook()
	if getBook != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getBook, "msg": "get book successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get book successfully"})
	}
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

var _ interfaces.BookControllerInterface = &BookController{}