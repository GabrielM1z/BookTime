package controller

import (
	"database/sql"
	"net/http"

	"book/controller/interfaces"
	"book/model"
	"book/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
	id, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid library ID"})
		return
	}

	library, err := repoLibrary.SelectLibrary(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "error retrieving library"})
		return
	}

	if library.IdLibrary != uuid.Nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": library, "msg": "library retrieved successfully"})
	} else {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "data": nil, "msg": "library not found"})
	}
}

// GetLibrariesByUserId implements LibraryControllerInterface
func (lc *LibraryController) GetLibrariesByUserId(c *gin.Context) {
	db := lc.DB
	repoLibrary := repository.NewLibraryRepository(db)
	idUser := getUserID(c)
	var getLibrary []model.Library
	if idUser != uuid.Nil {
		getLibrary = repoLibrary.SelectLibraryByUser(idUser)
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
	idUser := getUserID(c)
	if err := c.ShouldBindJSON(&post); err == nil {
		repoLibrary := repository.NewLibraryRepository(db)
		insert := repoLibrary.InsertLibrary(post, idUser)
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
	id, err := uuid.Parse(idParam)
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
	id, err := uuid.Parse(idParam)
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
