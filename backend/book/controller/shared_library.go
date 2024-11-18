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

type SharedLibraryController struct {
	DB *sql.DB
}

func NewSharedLibraryController(db *sql.DB) *SharedLibraryController {
	return &SharedLibraryController{DB: db}
}

// GetSharedLibraries implements SharedLibraryControllerInterface
func (slc *SharedLibraryController) GetSharedLibraries(c *gin.Context) {
	db := slc.DB
	repoSharedLibrary := repository.NewSharedLibraryRepository(db)
	getSharedLibraries := repoSharedLibrary.SelectSharedLibraries()
	if getSharedLibraries != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getSharedLibraries, "msg": "get shared libraries successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get shared libraries successfully"})
	}
}

func (slc *SharedLibraryController) GetSharedLibrary(c *gin.Context) {
	db := slc.DB
	repoSharedLibrary := repository.NewSharedLibraryRepository(db)

	// Récupère l'ID depuis les paramètres de la requête
	idUserParam := c.Param("id_user")
	idLibraryParam := c.Param("id_library")
	idUser, err := strconv.ParseUint(idUserParam, 10, 32) // Convertir en uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid sharedLibrary ID"})
		return
	}
	idLibrary, err := strconv.ParseUint(idLibraryParam, 10, 32) // Convertir en uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid sharedLibrary ID"})
		return
	}

	// Récupère le format avec l'ID
	sharedLibrary, err := repoSharedLibrary.SelectSharedLibrary(uint(idUser), uint(idLibrary))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "error retrieving sharedlibrary"})
		return
	}

	// Vérification si le format existe via son ID
	if sharedLibrary.IdUser != 0 {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": sharedLibrary, "msg": "sharedLibrary retrieved successfully"})
	} else {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "data": nil, "msg": "sharedLibrary not found"})
	}
}

// InsertSharedLibrary implements SharedLibraryControllerInterface
func (slc *SharedLibraryController) InsertSharedLibrary(c *gin.Context) {
	db := slc.DB
	var post model.PostSharedLibrary
	if err := c.ShouldBindJSON(&post); err == nil {
		repoSharedLibrary := repository.NewSharedLibraryRepository(db)
		insert := repoSharedLibrary.InsertSharedLibrary(post)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert shared library successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert shared library failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}

func (slc *SharedLibraryController) UpdateSharedLibrary(c *gin.Context) {
	db := slc.DB
	idUserParam := c.Param("id_user")
	idLibraryParam := c.Param("id_library")
	idUser, err := strconv.ParseUint(idUserParam, 10, 32) // Convertir en uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid sharedLibrary ID"})
		return
	}
	idLibrary, err := strconv.ParseUint(idLibraryParam, 10, 32) // Convertir en uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid sharedLibrary ID"})
		return
	}

	var sharedLibrary model.SharedLibrary
	if err := c.ShouldBindJSON(&sharedLibrary); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	repoSharedLibrary := repository.NewSharedLibraryRepository(db)
	success := repoSharedLibrary.UpdateSharedLibrary(uint(idUser), uint(idLibrary), sharedLibrary)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update sharedLibrary"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "sharedLibrary updated successfully"})
}

func (slc *SharedLibraryController) DeleteSharedLibrary(c *gin.Context) {
	db := slc.DB
	idUserParam := c.Param("id_user")
	idLibraryParam := c.Param("id_library")
	idUser, err := strconv.ParseUint(idUserParam, 10, 32) // Convertir en uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid sharedLibrary ID"})
		return
	}
	idLibrary, err := strconv.ParseUint(idLibraryParam, 10, 32) // Convertir en uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid sharedLibrary ID"})
		return
	}

	repoSharedLibrary := repository.NewSharedLibraryRepository(db)
	success := repoSharedLibrary.DeleteSharedLibrary(uint(idUser), uint(idLibrary))
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete SharedLibrary"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "SharedLibrary deleted successfully"})
}

var _ interfaces.SharedLibraryControllerInterface = &SharedLibraryController{}
