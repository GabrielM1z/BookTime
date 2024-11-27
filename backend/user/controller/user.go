package controller

import (
	"database/sql"
	"net/http"
	"strconv"

	"user/controller/interfaces"
	"user/model"
	"user/repository"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	DB *sql.DB
}

func NewUserController(db *sql.DB) *UserController {
	return &UserController{DB: db}
}

func (bc *UserController) GetUser(c *gin.Context) {
	db := bc.DB
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	repoUser := repository.NewUserRepository(db)
	user, err := repoUser.SelectUser(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
		return
	}

	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": user, "msg": "get user successfully"})
}

// InsertBook implements UserControllerInterface
func (bc *UserController) InsertBook(c *gin.Context) {
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

func (bc *UserController) UpdateBook(c *gin.Context) {
	db := bc.DB
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	var book model.Book
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	repoBook := repository.NewBookRepository(db)
	success := repoBook.UpdateBook(id, book)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update book"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Book updated successfully"})
}

func (bc *UserController) DeleteBook(c *gin.Context) {
	db := bc.DB
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	repoBook := repository.NewBookRepository(db)
	success := repoBook.DeleteBook(id)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete book"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Book deleted successfully"})
}

var _ interfaces.UserControllerInterface = &UserController{}
