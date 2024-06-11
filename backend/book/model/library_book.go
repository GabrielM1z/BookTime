package model

type LibraryBook struct {
	IdLibrary uint `json:"id_library"`
	IdBook    uint `json:"id_book"`
}

type PostLibraryBook struct {
	LibraryId uint `json:"id_library" binding:"required"`
	BookId    uint `json:"id_book" binding:"required"`
}
