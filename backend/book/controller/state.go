package controller

import (
	"database/sql"
	"net/http"

	"booktime/model"
	"booktime/repository"
	"booktime/controller/interfaces"

	"github.com/gin-gonic/gin"
)

type StateController struct {
	DB *sql.DB
}

func NewStateController(db *sql.DB) *StateController {
	return &StateController{DB: db}
}

// GetState implements StateControllerInterface
func (sc *StateController) GetState(c *gin.Context) {
	db := sc.DB
	repoState := repository.NewStateRepository(db)

	idUser := c.Query("id_user")
	idBook := c.Query("id_book")

	var getState []model.State
	if idUser != "" && idBook != "" {
		getState = repoState.SelectStateByUserAndBook(idUser, idBook)
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
	getState := repoState.SelectState()
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

var _ interfaces.StateControllerInterface = &StateController{}