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

type LibraryController struct {
	DB *sql.DB
}

func NewLibraryController(db *sql.DB) *LibraryController {
	return &LibraryController{DB: db}
}

// GetLibraries - Récupère toutes les bibliothèques
func (lc *LibraryController) GetLibraries(c *gin.Context) {
	db := lc.DB
	repoLibrary := repository.NewLibraryRepository(db)
	libraries := repoLibrary.SelectLibraries()
	if libraries != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": libraries, "msg": "libraries retrieved successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "no libraries found"})
	}
}

// GetLibrary - Récupère une bibliothèque par son ID
func (lc *LibraryController) GetLibrary(c *gin.Context) {
	db := lc.DB
	repoLibrary := repository.NewLibraryRepository(db)

	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid library ID"})
		return
	}

	library, err := repoLibrary.SelectLibrary(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "error retrieving library"})
		return
	}

	if library.IdLibrary != 0 {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": library, "msg": "library retrieved successfully"})
	} else {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "data": nil, "msg": "library not found"})
	}
}

// GetLibrariesByUserId implements LibraryControllerInterface
func (lc *LibraryController) GetLibrariesByUserId(c *gin.Context) {
	db := lc.DB
	repoLibrary := repository.NewLibraryRepository(db)
	idUser := c.Param("userId")
	var getLibrary []model.Library
	id, err := strconv.ParseUint(idUser, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid library ID"})
		return
	}
	if idUser != "" {
		getLibrary = repoLibrary.SelectLibraryByUser(uint(id))
	}
	if getLibrary != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getLibrary, "msg": "get library successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get library successfully"})
	}
}

// InsertLibrary - Insère une nouvelle bibliothèque
func (lc *LibraryController) InsertLibrary(c *gin.Context) {
	db := lc.DB
	var post model.PostLibrary
	if err := c.ShouldBindJSON(&post); err == nil {
		repoLibrary := repository.NewLibraryRepository(db)
		insert := repoLibrary.InsertLibrary(post)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "library inserted successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert library failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}

// UpdateLibrary - Met à jour une bibliothèque
func (lc *LibraryController) UpdateLibrary(c *gin.Context) {
	db := lc.DB
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid library ID"})
		return
	}

	var library model.Library
	if err := c.ShouldBindJSON(&library); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	repoLibrary := repository.NewLibraryRepository(db)
	success := repoLibrary.UpdateLibrary(id, library)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update library"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Library updated successfully"})
}

// DeleteLibrary - Supprime une bibliothèque
func (lc *LibraryController) DeleteLibrary(c *gin.Context) {
	db := lc.DB
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid library ID"})
		return
	}

	repoLibrary := repository.NewLibraryRepository(db)
	success := repoLibrary.DeleteLibrary(id)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete library"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Library deleted successfully"})
}

var _ interfaces.LibraryControllerInterface = &LibraryController{}
