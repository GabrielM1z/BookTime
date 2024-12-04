package model

import "github.com/google/uuid"

type SharedLibrary struct {
	IdUser    uuid.UUID `json:"id_user"`
	IdLibrary uuid.UUID `json:"id_library"`
}

type PostSharedLibrary struct {
	IdLibrary uuid.UUID `json:"id_library" binding:"required"`
}
