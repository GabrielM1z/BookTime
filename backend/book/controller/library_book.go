package controller

import (
	"database/sql"
	"net/http"

	"booktime/model"
	"booktime/repository"
	"booktime/controller/interfaces"

	"github.com/gin-gonic/gin"
)

type LibraryBookController struct {
	DB *sql.DB
}

func NewLibraryBookController(db *sql.DB) *LibraryBookController {
	return &LibraryBookController{DB: db}
}

// GetLibraryBook implements LibraryBookControllerInterface
func (lbc *LibraryBookController) GetLibraryBook(c *gin.Context) {
	db := lbc.DB
	repoLibraryBook := repository.NewLibraryBookRepository(db)
	getLibraryBook := repoLibraryBook.SelectLibraryBook()
	if getLibraryBook != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getLibraryBook, "msg": "get library book successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get library book successfully"})
	}
}

// InsertLibraryBook implements LibraryBookControllerInterface
func (lbc *LibraryBookController) InsertLibraryBook(c *gin.Context) {
	db := lbc.DB
	var post model.PostLibraryBook
	if err := c.ShouldBindJSON(&post); err == nil {
		repoLibraryBook := repository.NewLibraryBookRepository(db)
		insert := repoLibraryBook.InsertLibraryBook(post)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert library book successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert library book failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}

var _ interfaces.LibraryBookControllerInterface = &LibraryBookController{}