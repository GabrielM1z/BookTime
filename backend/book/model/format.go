package model

type Format struct {
	IdFormat uint   `json:"id_format"`
	Name     string `json:"name"`
}

type PostFormat struct {
	Name string `json:"name" binding:"required"`
}
