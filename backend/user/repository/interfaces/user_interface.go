package interfaces

import (
	"user/model"

	"github.com/google/uuid"
)

type UserRepositoryInterface interface {
	InsertUser(user model.User) bool
	SelectUser(id uuid.UUID) (*model.User, error)
	SelectUsers() []model.User
	UpdateUser(user model.User) bool
	DeleteUser(id uuid.UUID) bool
}
