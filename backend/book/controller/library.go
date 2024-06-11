package controller

import (
	"database/sql"
	"net/http"

	"booktime/model"
	"booktime/repository"

	"github.com/gin-gonic/gin"
)

type LibraryController struct {
	DB *sql.DB
}

func NewLibraryController(db *sql.DB) LibraryControllerInterface {
	return &LibraryController{DB: db}
}

// GetLibrary implements LibraryControllerInterface
func (lc *LibraryController) GetLibrary(c *gin.Context) {
	db := lc.DB
	repoLibrary := repository.NewLibraryRepository(db)
	getLibrary := repoLibrary.SelectLibrary()
	if getLibrary != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getLibrary, "msg": "get library successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get library successfully"})
	}
}

// InsertLibrary implements LibraryControllerInterface
func (lc *LibraryController) InsertLibrary(c *gin.Context) {
	db := lc.DB
	var post model.PostLibrary
	if err := c.ShouldBindJSON(&post); err == nil {
		repoLibrary := repository.NewLibraryRepository(db)
		insert := repoLibrary.InsertLibrary(post)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert library successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert library failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}
