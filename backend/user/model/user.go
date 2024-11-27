package model

type User struct {
	IdUser         uint   `json:"id_user"`
	IdKeycloak     string `json:"id_keycloak"`
	UserName       string `json:"user_name"`
	FirstName      string `json:"first_name"`
	LastName       string `json:"last_name"`
	Email          string `json:"email"`
	Birthdate      string `json:"birthdate"`
	Private        string `json:"private"`
	ProfilImageUrl string `json:"profil_image_url"`
	CoverImageUrl  string `json:"cover_image_url"`
}

type PostUser struct {
	IdKeycloak string `json:"id_keycloak" binding:"required"`
	UserName   string `json:"user_name" binding:"required"`
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	Email      string `json:"email" binding:"required"`
	Birthdate  string `json:"birthdate"`
	Private    string `json:"private"`
}
