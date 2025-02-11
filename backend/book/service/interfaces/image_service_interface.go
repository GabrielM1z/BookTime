package interfaces

type ImageServiceInterface interface {
	SaveBookImage(imageURL string, bookID string) (string, error)
}
