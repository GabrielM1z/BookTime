package model

type Library struct {
	IdLibrary uint   `json:"id_library"`
	Name      string `json:"name"`
}

type PostLibrary struct {
	Name string `json:"name" binding:"required"`
}
