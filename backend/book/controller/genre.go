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

type GenreController struct {
	DB *sql.DB
}

func NewGenreController(db *sql.DB) *GenreController {
	return &GenreController{DB: db}
}

// // GetGenre implements GenreControllerInterface
// func (gc *GenreController) GetGenre(c *gin.Context) {
// 	db := gc.DB
// 	repoGenre := repository.NewGenreRepository(db)
// 	getGenre := repoGenre.SelectGenre()
// 	if getGenre != nil {
// 		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getGenre, "msg": "get genre successfully"})
// 	} else {
// 		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get genre successfully"})
// 	}
// }

// // InsertGenre implements GenreControllerInterface
// func (gc *GenreController) InsertGenre(c *gin.Context) {
// 	db := gc.DB
// 	var post model.PostGenre
// 	if err := c.ShouldBindJSON(&post); err == nil {
// 		repoGenre := repository.NewGenreRepository(db)
// 		insert := repoGenre.InsertGenre(post)
// 		if insert {
// 			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert genre successfully"})
// 		} else {
// 			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert genre failed"})
// 		}
// 	} else {
// 		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
// 	}
// }

// GetGenres implements GenreControllerInterface
func (gc *GenreController) GetGenres(c *gin.Context) {
	db := gc.DB
	repoGenre := repository.NewGenreRepository(db)
	getGenres := repoGenre.SelectGenres()
	if getGenres != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getGenres, "msg": "genres retrieved successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "no genres found"})
	}
}

// GetGenre implements GenreControllerInterface
func (gc *GenreController) GetGenre(c *gin.Context) {
	db := gc.DB
	repoGenre := repository.NewGenreRepository(db)

	// Récupère l'ID depuis les paramètres de la requête
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32) // Convertir en uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid genre ID"})
		return
	}

	// Récupère le genre avec l'ID
	genre, err := repoGenre.SelectGenre(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "error retrieving genre"})
		return
	}

	// Vérification si le genre existe via son ID
	if genre.IdGenre != 0 {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": genre, "msg": "genre retrieved successfully"})
	} else {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "data": nil, "msg": "genre not found"})
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
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "genre inserted successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert genre failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}

func (gc *GenreController) UpdateGenre(c *gin.Context) {
	db := gc.DB
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid genre ID"})
		return
	}

	var genre model.Genre
	if err := c.ShouldBindJSON(&genre); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	repoGenre := repository.NewGenreRepository(db)
	success := repoGenre.UpdateGenre(id, genre)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update genre"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Genre updated successfully"})
}

func (gc *GenreController) DeleteGenre(c *gin.Context) {
	db := gc.DB
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid genre ID"})
		return
	}

	repoGenre := repository.NewGenreRepository(db)
	success := repoGenre.DeleteGenre(id)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete genre"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Format deleted successfully"})
}

var _ interfaces.GenreControllerInterface = &GenreController{}
