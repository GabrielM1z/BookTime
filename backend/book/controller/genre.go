package controller

import (
	"database/sql"
	"net/http"

	"booktime/model"
	"booktime/repository"

	"github.com/gin-gonic/gin"
)

type GenreController struct {
	DB *sql.DB
}

func NewGenreController(db *sql.DB) GenreControllerInterface {
	return &GenreController{DB: db}
}

// GetGenre implements GenreControllerInterface
func (gc *GenreController) GetGenre(c *gin.Context) {
	db := gc.DB
	repoGenre := repository.NewGenreRepository(db)
	getGenre := repoGenre.SelectGenre()
	if getGenre != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getGenre, "msg": "get genre successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get genre successfully"})
	}
}

// InsertGenre implements GenreControllerInterface
func (gc *GenreController) InsertGenre(c *gin.Context) {
	db := gc.DB
	var post model.PostGenre
	if err := c.ShouldBindJSON(&post); err == nil {
		repoGenre := repository.NewGenreRepository(db)
		insert := repoGenre.InsertGenre(post)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert genre successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert genre failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}
