package controller

import (
	"database/sql"
	"net/http"

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

// GetSharedLibrary implements SharedLibraryControllerInterface
func (slc *SharedLibraryController) GetSharedLibrary(c *gin.Context) {
	db := slc.DB
	repoSharedLibrary := repository.NewSharedLibraryRepository(db)
	getSharedLibrary := repoSharedLibrary.SelectSharedLibrary()
	if getSharedLibrary != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getSharedLibrary, "msg": "get shared library successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get shared library successfully"})
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

var _ interfaces.SharedLibraryControllerInterface = &SharedLibraryController{}
