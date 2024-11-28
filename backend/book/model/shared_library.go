package model

type SharedLibrary struct {
	IdUser    string `json:"id_user"`
	IdLibrary uint   `json:"id_library"`
}

type PostSharedLibrary struct {
	LibraryId uint `json:"id_library" binding:"required"`
}
