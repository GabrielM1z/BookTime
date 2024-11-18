package controller

import (
	"database/sql"
	"net/http"
	"strconv"

	"book/controller/interfaces"
	"book/model"
	"book/repository"

	"github.com/gin-gonic/gin"
)

type BookAuthorController struct {
	DB *sql.DB
}

func NewBookAuthorController(db *sql.DB) *BookAuthorController {
	return &BookAuthorController{DB: db}
}

// GetBookAuthors récupère toutes les relations entre livres et auteurs
func (bac *BookAuthorController) GetBookAuthors(c *gin.Context) {
	db := bac.DB
	repoBookAuthor := repository.NewBookAuthorRepository(db)
	getBookAuthors := repoBookAuthor.SelectBookAuthors()
	if getBookAuthors != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getBookAuthors, "msg": "get book authors successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "no book authors found"})
	}
}

// GetBookAuthor récupère une relation spécifique entre un livre et un auteur
func (bac *BookAuthorController) GetBookAuthor(c *gin.Context) {
	db := bac.DB
	repoBookAuthor := repository.NewBookAuthorRepository(db)

	idAuthorParam := c.Param("id_author")
	idBookParam := c.Param("id_book")
	idAuthor, err := strconv.ParseUint(idAuthorParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid book author ID"})
		return
	}
	idBook, err := strconv.ParseUint(idBookParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid book author ID"})
		return
	}

	bookAuthor, err := repoBookAuthor.SelectBookAuthor(uint(idAuthor), uint(idBook))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "error retrieving book author"})
		return
	}

	if bookAuthor.IdAuthor != 0 {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": bookAuthor, "msg": "book author retrieved successfully"})
	} else {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "data": nil, "msg": "book author not found"})
	}
}

// InsertBookAuthor ajoute une nouvelle relation entre un livre et un auteur
func (bac *BookAuthorController) InsertBookAuthor(c *gin.Context) {
	db := bac.DB
	var post model.PostBookAuthor
	if err := c.ShouldBindJSON(&post); err == nil {
		repoBookAuthor := repository.NewBookAuthorRepository(db)
		insert := repoBookAuthor.InsertBookAuthor(post)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert book author successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert book author failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}

// DeleteBookAuthor supprime une relation entre un livre et un auteur
func (bac *BookAuthorController) DeleteBookAuthor(c *gin.Context) {
	db := bac.DB
	idAuthorParam := c.Param("id_author")
	idBookParam := c.Param("id_book")
	idAuthor, err := strconv.ParseUint(idAuthorParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid book author ID"})
		return
	}
	idBook, err := strconv.ParseUint(idBookParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid book author ID"})
		return
	}

	repoBookAuthor := repository.NewBookAuthorRepository(db)
	success := repoBookAuthor.DeleteBookAuthor(uint(idAuthor), uint(idBook))
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete book author"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "book author deleted successfully"})
}

var _ interfaces.BookAuthorControllerInterface = &BookAuthorController{}
