package controller

import (
	"net/http"
	"time"

	"user/controller/interfaces"
	"user/model"
	"user/service"

	"github.com/gin-gonic/gin"
)

type synchroController struct {
	SynchroService *service.SynchroService
}

func NewSynchroController(SynchroService *service.SynchroService) *synchroController {
	return &synchroController{SynchroService: SynchroService}
}

func (bc *synchroController) Synchro(c *gin.Context) {
	lastSyncDate := c.Param("lastSyncDate")
	var uuidUser = getUserID(c)
	var actions []model.Action
	if err := c.ShouldBindJSON(&actions); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "problem with datas"})
		return
	}

	actions_to_exec, err := bc.SynchroService.Synchro(uuidUser, actions, lastSyncDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	type ReturningDatas struct {
		RequiredBooks []string       `json:"required_books"`
		ActionsToExec []model.Action `json:"actions_to_exec"`
		SyncDate      string         `json:"sync_date"`
	}

	datas := ReturningDatas{
		ActionsToExec: actions_to_exec,
		SyncDate:      time.Now().Format(time.RFC3339),
	}

	c.JSON(http.StatusOK, datas)

}

var _ interfaces.SynchroControllerInterface = &synchroController{}
