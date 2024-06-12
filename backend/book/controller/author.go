package controller

import (
	"database/sql"
	"net/http"

	"booktime/model"
	"booktime/repository"
	"booktime/controller/interfaces"

	"github.com/gin-gonic/gin"
)

type AuthorController struct {
	DB *sql.DB
}

func NewAuthorController(db *sql.DB) *AuthorController {
	return &AuthorController{DB: db}
}

// GetAuthor implements AuthorControllerInterface
func (ac *AuthorController) GetAuthor(c *gin.Context) {
	db := ac.DB
	repoAuthor := repository.NewAuthorRepository(db)
	getAuthor := repoAuthor.SelectAuthor()
	if getAuthor != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getAuthor, "msg": "get author successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get author successfully"})
	}
}

// InsertAuthor implements AuthorControllerInterface
func (ac *AuthorController) InsertAuthor(c *gin.Context) {
	db := ac.DB
	var post model.PostAuthor
	if err := c.ShouldBindJSON(&post); err == nil {
		repoAuthor := repository.NewAuthorRepository(db)
		insert := repoAuthor.InsertAuthor(post)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert author successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert author failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}

var _ interfaces.AuthorControllerInterface = &AuthorController{}