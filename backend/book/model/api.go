package model

type VolumeInfo struct {
	Title               string   `json:"title"`
	Authors             []string `json:"authors"`
	Categories          []string `json:"categories"`
	Publisher           string   `json:"publisher"`
	PublishedDate       string   `json:"publishedDate"`
	Description         string   `json:"description"`
	IndustryIdentifiers []struct {
		Type       string `json:"type"`
		Identifier string `json:"identifier"`
	} `json:"industryIdentifiers"`
	PageCount  int    `json:"pageCount"`
	Language   string `json:"language"`
	ImageLinks struct {
		Thumbnail string `json:"thumbnail"`
	} `json:"imageLinks"`
}

type BookItem struct {
	ID         string     `json:"id"`
	VolumeInfo VolumeInfo `json:"volumeInfo"`
}

type BookAPIResponse struct {
	Items []BookItem `json:"items"`
}

type SimplifiedBook struct {
	Title         string   `json:"title"`
	Authors       []string `json:"authors"`
	Categories    []string `json:"categories"`
	Publisher     string   `json:"publisher"`
	PublishedDate string   `json:"publishedDate"`
	Description   string   `json:"description"`
	PageCount     int      `json:"pageCount"`
	Language      string   `json:"language"`
	ISBN13        string   `json:"isbn13"`
	Thumbnail     string   `json:"thumbnail"`
}
