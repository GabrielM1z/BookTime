package controller

import (
	"database/sql"
	"net/http"

	"booktime/model"
	"booktime/repository"
	"booktime/controller/interfaces"

	"github.com/gin-gonic/gin"
)

type FormatController struct {
	DB *sql.DB
}

func NewFormatController(db *sql.DB) *FormatController {
	return &FormatController{DB: db}
}

// GetFormat implements FormatControllerInterface
func (fc *FormatController) GetFormat(c *gin.Context) {
	db := fc.DB
	repoFormat := repository.NewFormatRepository(db)
	getFormat := repoFormat.SelectFormat()
	if getFormat != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getFormat, "msg": "get format successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get format successfully"})
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

var _ interfaces.FormatControllerInterface = &FormatController{}