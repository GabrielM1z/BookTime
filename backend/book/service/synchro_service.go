package service

import (
	"book/model"
	"book/repository"
	"database/sql"
	"slices"

	"book/service/interfaces"
)

type SynchroService struct {
	DB *sql.DB
}

func NewSynchroService(db *sql.DB) *SynchroService {
	return &SynchroService{DB: db}
}

func (ss *SynchroService) filteredActions(client_actions []model.Action) ([]model.Action, error) {
	return client_actions, nil
}

// Service principal pour chercher un livre
func (ss *SynchroService) Synchro(client_actions []model.Action) ([]model.Action, error) {

	server_actions := repository.NewActionRepository(ss.DB).SelectActions()

	mixed_actions := slices.Concat(server_actions, client_actions)

	client_actions_to_exec, err := ss.filteredActions(mixed_actions)

	return client_actions_to_exec, err
}

var _ interfaces.SynchroServiceInterface = &SynchroService{}
