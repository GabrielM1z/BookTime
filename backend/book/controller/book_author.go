package controller

import (
	"database/sql"
	"net/http"

	"booktime/model"
	"booktime/repository"

	"github.com/gin-gonic/gin"
)

type BookAuthorController struct {
	DB *sql.DB
}

func NewBookAuthorController(db *sql.DB) BookAuthorControllerInterface {
	return &BookAuthorController{DB: db}
}

// GetAuthor implements AuthorControllerInterface
func (ac *BookAuthorController) GetBookAuthor(c *gin.Context) {
	db := ac.DB
	repoBookAuthor := repository.NewBookAuthorRepository(db)
	getBookAuthor := repoBookAuthor.SelectBookAuthor()
	if getBookAuthor != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getBookAuthor, "msg": "get book_author successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get book_author successfully"})
	}
}

// InsertAuthor implements AuthorControllerInterface
func (ac *BookAuthorController) InsertBookAuthor(c *gin.Context) {
	db := ac.DB
	var post model.PostBookAuthor
	if err := c.ShouldBindJSON(&post); err == nil {
		repoBookAuthor := repository.NewBookAuthorRepository(db)
		insert := repoBookAuthor.InsertBookAuthor(post)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert book_author successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert book_author failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}
