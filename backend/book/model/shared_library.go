package model

type SharedLibrary struct {
	IdUser    uint `json:"id_user"`
	IdLibrary uint `json:"id_library"`
}

type PostSharedLibrary struct {
    UserId    uint `json:"id_user" binding:"required"`
    LibraryId uint `json:"id_library" binding:"required"`
}