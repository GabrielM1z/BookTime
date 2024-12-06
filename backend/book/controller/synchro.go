package controller

import (
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
	var actions []model.Action
	if err := c.ShouldBindJSON(&actions); err != nil {
		log.Println("err")
		log.Println(err)
		log.Println("actions")
		log.Println(actions)
		c.JSON(http.StatusBadRequest, gin.H{"error": "problem with datas"})
		return
	}

	// log.Println("[]byte(jsonData)")
	// log.Println([]byte(jsonData))

	// Convertir la chaîne JSON en slice d'Action
	// var actions []model.Action lalalal
	// err := json.Unmarshal([]byte(jsonData), &actions)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format: " + err.Error()})
	// 	return
	// }  lalalal

	actions_to_exec, err := bc.SynchroService.Synchro(uuidUser, actions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, actions_to_exec)
}

var _ interfaces.SynchroControllerInterface = &synchroController{}
