package model

type User struct {
	IdUser      string `json:"idUser"`
	Private     string `json:"private"`
	ProfilImage string `json:"profilImage"`
	BannerImage string `json:"bannerImage"`
	Birthday    string `json:"birthdate"`
}

type PostUser struct {
	Private     string `json:"private"`
	ProfilImage string `json:"profilImage"`
	BannerImage string `json:"bannerImage"`
	Birthday    string `json:"birthdate"`
}
