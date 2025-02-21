package controller

import (
	"database/sql"
	"log"
	"net/http"
	"strings"

	"book/controller/interfaces"
	"book/model"
	"book/repository"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

type StateController struct {
	DB *sql.DB
}

func NewStateController(db *sql.DB) *StateController {
	return &StateController{DB: db}
}

// GetState implements StateControllerInterface
func (sc *StateController) GetStateByUserAndBook(c *gin.Context) {
	db := sc.DB
	repoState := repository.NewStateRepository(db)

	uuidUser := getUserID(c)
	idBook := c.Param("bookId")

	if uuidUser != uuid.Nil {
		getState, err := repoState.SelectStateByUserAndBook(uuidUser, idBook)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "failed to get state"})
			return
		} else {
			c.JSON(http.StatusOK, gin.H{"status": "success", "data": getState, "msg": "get state successfully"})
			return
		}
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "ID user null"})
		return
	}
}

// GetState implements StateControllerInterface
func (sc *StateController) GetStates(c *gin.Context) {
	db := sc.DB
	repoState := repository.NewStateRepository(db)
	getState := repoState.SelectStates()
	if getState != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getState, "msg": "get state successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get state successfully"})
	}
}

func getUserID(c *gin.Context) uuid.UUID {
	// Récupérer le jeton d'authentification depuis l'en-tête Authorization
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
		return uuid.Nil
	}

	// Vérifier si le jeton est de type Bearer
	if !strings.HasPrefix(authHeader, "Bearer ") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
		return uuid.Nil
	}

	// Extraire le token
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	// Décoder le token sans validation pour extraire les claims (utilisez un clé si nécessaire pour vérifier la signature)
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return uuid.Nil
	}

	// Convertir les claims en jwt.MapClaims pour extraire "sub"
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return uuid.Nil
	}

	// Récupérer le champ "sub" (subject)
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

// InsertState implements StateControllerInterface
func (sc *StateController) InsertState(c *gin.Context) {
	db := sc.DB
	var state model.State
	if err := c.ShouldBindJSON(&state); err == nil {
		state.IdUser = getUserID(c)
		repoState := repository.NewStateRepository(db)
		insert := repoState.InsertState(state)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "insert state successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert state failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}

func (sc *StateController) GetState(c *gin.Context) {

	db := sc.DB
	repoState := repository.NewStateRepository(db)

	uuidUser := getUserID(c)
	idBook := c.Param("bookId")

	getState, err := repoState.SelectStateByUserAndBook(uuidUser, idBook)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "failed to get state"})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getState, "msg": "get state successfully"})
		return
	}
}

func (sc *StateController) UpdateState(c *gin.Context) {
	log.Println("CONTROLLER : UpdateState")
	db := sc.DB
	repoState := repository.NewStateRepository(db)

	uuidUser := getUserID(c)
	idBook := c.Param("bookId")
	log.Println(idBook)

	// Liaison JSON avec le modèle
	var state model.State
	if err := c.ShouldBindJSON(&state); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
		return
	}

	// Mise à jour de l'état
	updatedRows := repoState.UpdateState(uuidUser, idBook, state)
	if updatedRows {
		c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "state updated successfully"})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "failed to update state"})
	}
}

func (sc *StateController) DeleteState(c *gin.Context) {
	db := sc.DB
	repoState := repository.NewStateRepository(db)

	uuidUser := getUserID(c)
	idBook := c.Param("bookId")

	// Suppression de l'état
	deletedRows := repoState.DeleteState(uuidUser, idBook)
	if deletedRows {
		c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "state deleted successfully"})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "failed to delete state"})
	}
}

var _ interfaces.StateControllerInterface = &StateController{}
