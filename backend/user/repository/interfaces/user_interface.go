package interfaces

import (
	"time"
	"user/model"

	"github.com/google/uuid"
)

type UserRepositoryInterface interface {
	InsertUser(user model.User, actionDate ...time.Time) bool
	SelectUser(id uuid.UUID) (*model.User, error)
	SelectUsers() []model.User
	UpdateUser(user model.User, actionDate ...time.Time) bool
	DeleteUser(id uuid.UUID, actionDate ...time.Time) bool
}
