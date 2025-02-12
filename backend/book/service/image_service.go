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
	uploadPath    string
	publicURLBase string
}

func NewImageService(uploadPath, publicURLBase string) *ImageService {
	return &ImageService{
		uploadPath:    uploadPath,
		publicURLBase: publicURLBase,
	}
}

// Sauvegarde une image depuis une URL et l'enregistre localement
func (i *ImageService) SaveBookImage(imageURL string, bookID string) (string, error) {
	// Récupère l'image depuis l'URL
	resp, err := http.Get(imageURL)
	//resp, err := http.Get("http://books.google.com/books/content?id=tB4lDwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api")
	if err != nil {
		return "", fmt.Errorf("erreur lors du téléchargement de l'image: %v", err)
	}
	defer resp.Body.Close()

	// Vérifie si la requête a réussi
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("échec du téléchargement, statut: %d", resp.StatusCode)
	}

	// Détermine le chemin du fichier
	filename := fmt.Sprintf("book_%s.jpg", bookID)
	filePath := filepath.Join(i.uploadPath, filename)

	// Crée le répertoire s'il n'existe pas
	err = os.MkdirAll(i.uploadPath, os.ModePerm)
	if err != nil {
		return "", fmt.Errorf("erreur lors de la création du répertoire: %v", err)
	}

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
	publicURL := fmt.Sprintf("%s/images/%s", i.publicURLBase, filename)
	return publicURL, nil
}

var _ interfaces.ImageServiceInterface = &ImageService{}
