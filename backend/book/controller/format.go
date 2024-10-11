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

type FormatController struct {
	DB *sql.DB
}

func NewFormatController(db *sql.DB) *FormatController {
	return &FormatController{DB: db}
}

// GetFormat implements FormatControllerInterface
func (fc *FormatController) GetFormats(c *gin.Context) {
	db := fc.DB
	repoFormat := repository.NewFormatRepository(db)
	getFormat := repoFormat.SelectFormats()
	if getFormat != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getFormat, "msg": "get format successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get format successfully"})
	}
}

// GetFormat implements FormatControllerInterface
func (fc *FormatController) GetFormat(c *gin.Context) {
	db := fc.DB
	repoFormat := repository.NewFormatRepository(db)

	// Récupère l'ID depuis les paramètres de la requête
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32) // Convertir en uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid format ID"})
		return
	}

	// Récupère le format avec l'ID
	format, err := repoFormat.SelectFormat(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "error retrieving format"})
		return
	}

	// Vérification si le format existe via son ID
	if format.IdFormat != 0 {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": format, "msg": "format retrieved successfully"})
	} else {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "data": nil, "msg": "format not found"})
	}
}

// InsertFormat implements FormatControllerInterface
func (fc *FormatController) InsertFormat(c *gin.Context) {
	db := fc.DB
	var post model.PostFormat
	if err := c.ShouldBindJSON(&post); err == nil {
		repoFormat := repository.NewFormatRepository(db)
		insert := repoFormat.InsertFormat(post)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert format successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert format failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}

func (fc *FormatController) UpdateFormat(c *gin.Context) {
	db := fc.DB
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid format ID"})
		return
	}

	var format model.Format
	if err := c.ShouldBindJSON(&format); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	repoFormat := repository.NewFormatRepository(db)
	success := repoFormat.UpdateFormat(id, format)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update format"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Format updated successfully"})
}

func (fc *FormatController) DeleteFormat(c *gin.Context) {
	db := fc.DB
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid format ID"})
		return
	}

	repoFormat := repository.NewFormatRepository(db)
	success := repoFormat.DeleteFormat(id)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete format"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Format deleted successfully"})
}

var _ interfaces.FormatControllerInterface = &FormatController{}
