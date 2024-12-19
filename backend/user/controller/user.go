package controller

import (
	"database/sql"
	"net/http"
	"user/controller/interfaces"
	"user/model"
	"user/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
	id, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid user ID"})
		return
	}
	User, err := repoUser.SelectUser(id)
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

func (bc *UserController) GetUsers(c *gin.Context) {
	db := bc.DB
	repoUser := repository.NewUserRepository(db)
	getUser := repoUser.SelectUsers()
	if getUser != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getUser, "msg": "get users successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get users successfully"})
	}
}

// InsertUser implements UserControllerInterface
func (bc *UserController) InsertUser(c *gin.Context) {
	db := bc.DB
	var post model.User
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

func (bc *UserController) DeleteUser(c *gin.Context) {
	db := bc.DB
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	repoUser := repository.NewUserRepository(db)
	success := repoUser.DeleteUser(id)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func (uc *UserController) UpdateUser(c *gin.Context) {
	db := uc.DB
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid library ID"})
		return
	}

	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user.IdUser = id

	repoUser := repository.NewUserRepository(db)
	success := repoUser.UpdateUser(user)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "user updated successfully"})
}

var _ interfaces.UserControllerInterface = &UserController{}
