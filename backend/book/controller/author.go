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

type AuthorController struct {
	DB *sql.DB
}

func NewAuthorController(db *sql.DB) *AuthorController {
	return &AuthorController{DB: db}
}

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

func (ac *AuthorController) UpdateAuthor(c *gin.Context) {
	db := ac.DB
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam) //parseInt
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid author ID"})
		return
	}

	var author model.Author
	if err := c.ShouldBindJSON(&author); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	repoAuthor := repository.NewAuthorRepository(db)
	success := repoAuthor.UpdateAuthor(id, author)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update author"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Author updated successfully"})
}

var _ interfaces.AuthorControllerInterface = &AuthorController{}
