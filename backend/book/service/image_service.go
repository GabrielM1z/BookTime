package service

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"book/service/interfaces"
)

type ImageService struct {
	uploadPath string
}

func NewImageService(uploadPath string) *ImageService {
	return &ImageService{uploadPath: uploadPath}
}

// Chemin où stocker les images
const storagePath = "/var/www/booktime/images/"

// Sauvegarde une image depuis une URL et l'enregistre localement
func (i *ImageService) SaveBookImage(imageURL string, bookID string) (string, error) {

	// Récupère l'image depuis l'URL
	resp, err := http.Get(imageURL)
	if err != nil {
		return "", fmt.Errorf("erreur lors du téléchargement de l'image: %v", err)
	}
	defer resp.Body.Close()

	// Vérifie si la requête a réussi
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("échec du téléchargement, statut: %d", resp.StatusCode)
	}

	// Détermine le chemin du fichier
	//filename := fmt.Sprintf("book_%d.jpg", bookID)
	filename := fmt.Sprintf("book_12345.jpg")
	filePath := filepath.Join(storagePath, filename)

	// Crée le fichier localement
	file, err := os.Create(filePath)
	if err != nil {
		return "", fmt.Errorf("erreur lors de la création du fichier: %v", err)
	}
	defer file.Close()

	// Écrit l'image dans le fichier
	_, err = io.Copy(file, resp.Body)
	if err != nil {
		return "", fmt.Errorf("erreur lors de l'écriture du fichier: %v", err)
	}

	// Retourne l'URL publique
	publicURL := fmt.Sprintf("http://yourdomain.com/images/%s", filename)
	return publicURL, nil
}

var _ interfaces.ImageServiceInterface = &ImageService{}
