package interfaces

import "user/model"

type UserRepositoryInterface interface {
	SelectUser(id int) (*model.User, error)
	InsertUser(post model.PostUser) bool
	UpdateUser(id int) bool
	DeleteUser(id int) bool
}
