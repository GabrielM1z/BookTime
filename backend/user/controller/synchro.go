package controller

import (
	"net/http"

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

	c.JSON(http.StatusOK, actions_to_exec)

}

var _ interfaces.SynchroControllerInterface = &synchroController{}
