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

type BookGenreController struct {
	DB *sql.DB
}

func NewBookGenreController(db *sql.DB) *BookGenreController {
	return &BookGenreController{DB: db}
}

// GetBookGenres récupère toutes les relations entre livres et genres
func (bgc *BookGenreController) GetBookGenres(c *gin.Context) {
	db := bgc.DB
	repoBookGenre := repository.NewBookGenreRepository(db)
	getBookGenres := repoBookGenre.SelectBookGenres()
	if getBookGenres != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getBookGenres, "msg": "get book genres successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "no book genres found"})
	}
}

// GetBookGenre récupère une relation spécifique entre un livre et un genre
func (bgc *BookGenreController) GetBookGenre(c *gin.Context) {
	db := bgc.DB
	repoBookGenre := repository.NewBookGenreRepository(db)

	idGenreParam := c.Param("id_genre")
	idBookParam := c.Param("id_book")
	idGenre, err := strconv.ParseUint(idGenreParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid book genre ID"})
		return
	}
	idBook, err := strconv.ParseUint(idBookParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid book genre ID"})
		return
	}

	bookGenre, err := repoBookGenre.SelectBookGenre(uint(idGenre), uint(idBook))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "error retrieving book genre"})
		return
	}

	if bookGenre.IdGenre != 0 {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": bookGenre, "msg": "book genre retrieved successfully"})
	} else {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "data": nil, "msg": "book genre not found"})
	}
}

// InsertBookGenre ajoute une nouvelle relation entre un livre et un genre
func (bgc *BookGenreController) InsertBookGenre(c *gin.Context) {
	db := bgc.DB
	var post model.PostBookGenre
	if err := c.ShouldBindJSON(&post); err == nil {
		repoBookGenre := repository.NewBookGenreRepository(db)
		insert := repoBookGenre.InsertBookGenre(post)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert book genre successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert book genre failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}

// DeleteBookGenre supprime une relation entre un livre et un genre
func (bgc *BookGenreController) DeleteBookGenre(c *gin.Context) {
	db := bgc.DB
	idGenreParam := c.Param("id_genre")
	idBookParam := c.Param("id_book")
	idGenre, err := strconv.ParseUint(idGenreParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid book genre ID"})
		return
	}
	idBook, err := strconv.ParseUint(idBookParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid book genre ID"})
		return
	}

	repoBookGenre := repository.NewBookGenreRepository(db)
	success := repoBookGenre.DeleteBookGenre(uint(idGenre), uint(idBook))
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete book genre"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "book genre deleted successfully"})
}

var _ interfaces.BookGenreControllerInterface = &BookGenreController{}
