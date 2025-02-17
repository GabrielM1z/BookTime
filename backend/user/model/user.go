package model

import "github.com/google/uuid"

type User struct {
	IdUser      uuid.UUID `json:"id_user"`
	Pseudo      string    `json:"pseudo"`
	Description string    `json:"description"`
	Private     bool      `json:"private"`
	ProfilImage string    `json:"profilImage"`
	BannerImage string    `json:"bannerImage"`
	Birthday    string    `json:"birthdate"`
}

type KeyUser struct {
	IdUser      uuid.UUID `json:"id_user"`
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	Pseudo      string    `json:"pseudo"`
	Description string    `json:"description"`
	Private     bool      `json:"private"`
	ProfilImage string    `json:"profil_image"`
	BannerImage string    `json:"banner_image"`
	Birthday    string    `json:"birthdate"`
}
