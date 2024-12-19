package controller

import (
	"database/sql"
	"net/http"
	"user/controller/interfaces"
	"user/model"
	"user/repository"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	DB *sql.DB
}

func NewUserController(db *sql.DB) *UserController {
	return &UserController{DB: db}
}

func (bc *UserController) GetUser(c *gin.Context) {
	db := bc.DB
	idParam := c.Param("id")

	repoUser := repository.NewUserRepository(db)
	User, err := repoUser.SelectUser(idParam)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve User"})
		return
	}

	if User == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": User, "msg": "get User successfully"})
}

// InsertUser implements UserControllerInterface
func (bc *UserController) InsertUser(c *gin.Context) {
	db := bc.DB
	var post model.PostUser
	if err := c.ShouldBindJSON(&post); err == nil {
		repoUser := repository.NewUserRepository(db)
		insert := repoUser.InsertUser(post)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert User successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert User failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}

var _ interfaces.UserControllerInterface = &UserController{}
