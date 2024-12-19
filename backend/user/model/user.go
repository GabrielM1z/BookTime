package model

import "github.com/google/uuid"

type User struct {
	IdUser      uuid.UUID `json:"idUser"`
	Private     string    `json:"private"`
	ProfilImage string    `json:"profilImage"`
	BannerImage string    `json:"bannerImage"`
	Birthday    string    `json:"birthdate"`
}

type PostUser struct {
	Private     string `json:"private"`
	ProfilImage string `json:"profilImage"`
	BannerImage string `json:"bannerImage"`
	Birthday    string `json:"birthdate"`
}
