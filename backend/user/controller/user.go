package controller

import (
	"database/sql"
	"errors"
	"net/http"
	"strings"
	"user/controller/interfaces"
	"user/model"
	"user/repository"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

type UserController struct {
	DB *sql.DB
}

func NewUserController(db *sql.DB) *UserController {
	return &UserController{DB: db}
}

func getUserID(c *gin.Context) uuid.UUID {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
		return uuid.Nil
	}

	if !strings.HasPrefix(authHeader, "Bearer ") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
		return uuid.Nil
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return uuid.Nil
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return uuid.Nil
	}

	sub, ok := claims["sub"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Subject (sub) not found in token"})
		return uuid.Nil
	}

	uuidSub, err := uuid.Parse(sub)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid UUID"})
		return uuid.Nil
	}

	return uuidSub
}

func getUserInfoFromToken(c *gin.Context) (string, string, error) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return "", "", errors.New("Authorization header is missing")
	}

	if !strings.HasPrefix(authHeader, "Bearer ") {
		return "", "", errors.New("Invalid token format")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		return "", "", errors.New("Invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", "", errors.New("Invalid token claims")
	}

	name, ok := claims["name"].(string)
	if !ok {
		return "", "", errors.New("Name not found in token")
	}

	email, ok := claims["email"].(string)
	if !ok {
		return "", "", errors.New("Email not found in token")
	}

	return name, email, nil
}

func (bc *UserController) GetUserFromToken(c *gin.Context) {
	db := bc.DB
	id := getUserID(c)
	if id == uuid.Nil {
		return
	}

	repoUser := repository.NewUserRepository(db)
	User, err := repoUser.SelectUser(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve User"})
		return
	}

	if User == nil {
		user := model.User{IdUser: id, Pseudo: "", Description: "", Private: false, ProfilImage: "", BannerImage: "", Birthday: "1900-01-01"}
		insert := repoUser.InsertUser(user)
		if !insert {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "User does not exist and insert User failed"})
		}
		User = &model.User{IdUser: id}
	}

	name, email, err := getUserInfoFromToken(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	kUser := model.KeyUser{User.IdUser, name, email, User.Pseudo, User.Description, User.Private, User.ProfilImage, User.BannerImage, User.Birthday}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": gin.H{
			"id":   kUser.IdUser,
			"user": kUser,
		},
		"msg": "get User successfully",
	})
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
