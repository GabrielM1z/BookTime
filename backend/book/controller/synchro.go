package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

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
	lastSyncDate := c.Param("lastSyncDate")
	var uuidUser = getUserID(c)
	var actions []model.Action
	if err := c.ShouldBindJSON(&actions); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "problem with datas"})
		return
	}

	fmt.Println("Synchro controler actions : ", actions)

	actions_to_exec, err := bc.SynchroService.Synchro(uuidUser, actions, lastSyncDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var required_books []string

	for _, action := range actions_to_exec {
		if action.TableName == "LIBRARY_BOOK" && action.Type == "INSERT" {
			var libraryBook model.LibraryBook
			err := json.Unmarshal(action.Action, &libraryBook)
			if err != nil {
				log.Fatalf("Erreur lors du décodage du JSON : %v", err)
			}
			required_books = append(required_books, libraryBook.IdBook)
		}
	}

	type ReturningDatas struct {
		RequiredBooks []string       `json:"required_books"`
		ActionsToExec []model.Action `json:"actions_to_exec"`
		SyncDate      string         `json:"sync_date"`
	}

	datas := ReturningDatas{
		RequiredBooks: required_books,
		ActionsToExec: actions_to_exec,
		SyncDate:      time.Now().Format(time.RFC3339),
	}

	c.JSON(http.StatusOK, datas)

}

var _ interfaces.SynchroControllerInterface = &synchroController{}
