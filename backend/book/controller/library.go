package controller

import (
	"database/sql"
	"net/http"

	"book/controller/interfaces"
	"book/model"
	"book/repository"

	"github.com/gin-gonic/gin"
)

type LibraryController struct {
	DB *sql.DB
}

func NewLibraryController(db *sql.DB) *LibraryController {
	return &LibraryController{DB: db}
}

// GetAllLibraries implements LibraryControllerInterface
func (lc *LibraryController) GetAllLibraries(c *gin.Context) {
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

// GetLibrariesByUserId implements LibraryControllerInterface
func (lc *LibraryController) GetLibrariesByUserId(c *gin.Context) {
	db := lc.DB
	repoLibrary := repository.NewLibraryRepository(db)
	idUser := c.Param("userId")
	var getLibrary []model.Library
	if idUser != "" {
		getLibrary = repoLibrary.SelectLibraryByUser(idUser)
	}
	if getLibrary != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getLibrary, "msg": "get library successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get library successfully"})
	}
}

var _ interfaces.LibraryControllerInterface = &LibraryController{}
