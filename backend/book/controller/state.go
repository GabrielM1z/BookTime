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

	idUser := c.Param("userId")
	idBook := c.Param("bookId")

	idUserUint, err := strconv.ParseUint(idUser, 10, 32) // Convertir en uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid genre ID"})
		return
	}

	idBookUint, err := strconv.ParseUint(idBook, 10, 32) // Convertir en uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid genre ID"})
		return
	}

	var getState []model.State
	if idUser != "" && idBook != "" {
		getState = repoState.SelectStateByUserAndBook(uint(idUserUint), uint(idBookUint))
	}

	if getState != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getState, "msg": "get state successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get state successfully"})
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

// InsertState implements StateControllerInterface
func (sc *StateController) InsertState(c *gin.Context) {
	db := sc.DB
	var post model.PostState
	if err := c.ShouldBindJSON(&post); err == nil {
		repoState := repository.NewStateRepository(db)
		insert := repoState.InsertState(post)
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

	idState := c.Param("stateId")

	// Récupère l'état par ID d'utilisateur et ID de livre
	id, err := strconv.ParseUint(idState, 10, 32) // Convertir en uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid genre ID"})
		return
	}
	state := repoState.SelectState(uint(id))
	if state.IdState != 0 {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": state, "msg": "state retrieved successfully"})
	} else {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "msg": "state not found"})
	}
}

func (sc *StateController) UpdateState(c *gin.Context) {
	db := sc.DB
	repoState := repository.NewStateRepository(db)

	idState := c.Param("stateId")

	// Récupère l'état par ID d'utilisateur et ID de livre
	id, err := strconv.ParseUint(idState, 10, 32) // Convertir en uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid genre ID"})
		return
	}

	// Liaison JSON avec le modèle
	var state model.State
	if err := c.ShouldBindJSON(&state); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
		return
	}

	// Mise à jour de l'état
	updatedRows := repoState.UpdateState(int(id), state)
	if updatedRows {
		c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "state updated successfully"})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "failed to update state"})
	}
}

func (sc *StateController) DeleteState(c *gin.Context) {
	db := sc.DB
	repoState := repository.NewStateRepository(db)

	idState := c.Param("stateId")

	id, err := strconv.ParseUint(idState, 10, 32) // Convertir en uint
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid genre ID"})
		return
	}

	// Suppression de l'état
	deletedRows := repoState.DeleteState(int(id))
	if deletedRows {
		c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "state deleted successfully"})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "failed to delete state"})
	}
}

var _ interfaces.StateControllerInterface = &StateController{}
