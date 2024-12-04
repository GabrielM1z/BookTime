package controller

import (
	"net/http"
	"time"

	"book/controller/interfaces"
	"book/model"
	"book/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type synchroController struct {
	SynchroService *service.SynchroService
}

func NewSynchroController(SynchroService *service.SynchroService) *synchroController {
	return &synchroController{SynchroService: SynchroService}
}

func (bc *synchroController) Synchro(c *gin.Context) {

	a1 := model.Action{
		IdAction:   uuid.New(),
		IdUser:     uuid.New(),
		Table:      "books",
		Date:       time.Now(),
		Type:       "update",
		Action:     []byte("Increment read count"),
		ExecutedBy: "system",
	}

	a2 := model.Action{
		IdAction:   uuid.New(),
		IdUser:     uuid.New(),
		Table:      "libraries",
		Date:       time.Now(),
		Type:       "create",
		Action:     []byte("Added new book to library"),
		ExecutedBy: "admin_user",
	}
	//recupe donnee
	actions_from_client := []model.Action{a1, a2}

	actions_to_exec, err := bc.SynchroService.Synchro(actions_from_client)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, actions_to_exec)
}

var _ interfaces.SynchroControllerInterface = &synchroController{}
