package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"book/controller/interfaces"
	"book/model"
	"book/service"

	"github.com/gin-gonic/gin"
)

type synchroController struct {
	SynchroService *service.SynchroService
}

func NewSynchroController(SynchroService *service.SynchroService) *synchroController {
	return &synchroController{SynchroService: SynchroService}
}

func (bc *synchroController) Synchro(c *gin.Context) {
	var uuidUser = getUserID(c)
	jsonData := c.Query("jsonData")
	if jsonData == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "jsonData is required"})
		return
	}

	log.Println("jsonData")
	log.Println(jsonData)
	// log.Println("[]byte(jsonData)")
	// log.Println([]byte(jsonData))

	// Convertir la chaîne JSON en slice d'Action
	var actions []model.Action
	err := json.Unmarshal([]byte(jsonData), &actions)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format: " + err.Error()})
		return
	}

	actions_to_exec, err := bc.SynchroService.Synchro(uuidUser, actions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, actions_to_exec)
}

var _ interfaces.SynchroControllerInterface = &synchroController{}
