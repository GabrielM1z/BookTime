package controller

import (
	"database/sql"
	"net/http"

	"booktime/model"
	"booktime/repository"
	"booktime/controller/interfaces"

	"github.com/gin-gonic/gin"
)

type BookGenreController struct {
	DB *sql.DB
}

func NewBookGenreController(db *sql.DB) *BookGenreController {
	return &BookGenreController{DB: db}
}

func (bgc *BookGenreController) InsertBookGenre(g *gin.Context) {
	db := bgc.DB
	var post model.PostBookGenre
	if err := g.ShouldBindJSON(&post); err == nil {
		repo := repository.NewBookGenreRepository(db)
		insert := repo.InsertBookGenre(post)
		if insert {
			g.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert book genre successfully"})
		} else {
			g.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert book genre failed"})
		}
	} else {
		g.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}

func (bgc *BookGenreController) GetBookGenres(g *gin.Context) {
	db := bgc.DB
	repo := repository.NewBookGenreRepository(db)
	genres := repo.SelectBookGenres()
	if genres != nil {
		g.JSON(http.StatusOK, gin.H{"status": "success", "data": genres, "msg": "get book genres successfully"})
	} else {
		g.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "get book genres failed"})
	}
}

var _ interfaces.BookGenreControllerInterface = &BookGenreController{}