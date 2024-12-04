package controller

import (
	"database/sql"
	"net/http"

	"book/controller/interfaces"
	"book/model"
	"book/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type LibraryBookController struct {
	DB *sql.DB
}

func NewLibraryBookController(db *sql.DB) *LibraryBookController {
	return &LibraryBookController{DB: db}
}

// GetLibraryBooks - Récupère tous les liens bibliothèque-livre
func (lc *LibraryBookController) GetLibraryBooks(c *gin.Context) {
	db := lc.DB
	repoLibraryBook := repository.NewLibraryBookRepository(db)
	libraryBooks := repoLibraryBook.SelectLibraryBooks()
	if libraryBooks != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": libraryBooks, "msg": "library books retrieved successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "no library books found"})
	}
}

// GetLibraryBook - Récupère un lien bibliothèque-livre spécifique
func (lc *LibraryBookController) GetLibraryBook(c *gin.Context) {
	db := lc.DB
	repoLibraryBook := repository.NewLibraryBookRepository(db)

	idLibraryParam := c.Param("id_library")
	idLibrary, err := uuid.Parse(idLibraryParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid library ID"})
		return
	}

	idBookParam := c.Param("id_book")
	idBook, err := uuid.Parse(idBookParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "msg": "invalid book ID"})
		return
	}

	libraryBook, err := repoLibraryBook.SelectLibraryBook(idLibrary, idBook)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "msg": "error retrieving library book"})
		return
	}

	if libraryBook.IdLibrary != uuid.Nil && libraryBook.IdBook != uuid.Nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": libraryBook, "msg": "library book retrieved successfully"})
	} else {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "data": nil, "msg": "library book not found"})
	}
}

// GetLibrariesByUserId implements LibraryControllerInterface
func (ldc *LibraryBookController) GetLibraryBookByLibraryId(c *gin.Context) {
	db := ldc.DB
	repoLibrary := repository.NewLibraryBookRepository(db)
	IdLibrary := c.Param("libraryId")
	var getLibraryBook []*model.Book
	if IdLibrary != "" {
		getLibraryBook = repoLibrary.SelectLibraryBookByLibrary(IdLibrary)
	}
	if getLibraryBook != nil {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": getLibraryBook, "msg": "get library book successfully"})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": nil, "msg": "get library book successfully"})
	}
}

// InsertLibraryBook - Insère un lien bibliothèque-livre
func (lc *LibraryBookController) InsertLibraryBook(c *gin.Context) {
	db := lc.DB
	idUser := getUserID(c)
	var post model.PostLibraryBook
	if err := c.ShouldBindJSON(&post); err == nil {
		repoLibraryBook := repository.NewLibraryBookRepository(db)
		insert := repoLibraryBook.InsertLibraryBook(post, idUser)
		if insert {
			c.JSON(http.StatusOK, gin.H{"status": "success", "msg": "library book inserted successfully"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "msg": "insert library book failed"})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "msg": err.Error()})
	}
}

// UpdateLibraryBook - Met à jour un lien bibliothèque-livre
func (lc *LibraryBookController) UpdateLibraryBook(c *gin.Context) {
	db := lc.DB
	idLibraryParam := c.Param("id_library")
	idLibrary, err := uuid.Parse(idLibraryParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid library ID"})
		return
	}

	idBookParam := c.Param("id_book")
	idBook, err := uuid.Parse(idBookParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	var libraryBook model.LibraryBook
	if err := c.ShouldBindJSON(&libraryBook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	repoLibraryBook := repository.NewLibraryBookRepository(db)
	success := repoLibraryBook.UpdateLibraryBook(idLibrary, idBook, libraryBook)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update library book"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Library book updated successfully"})
}

// DeleteLibraryBook - Supprime un lien bibliothèque-livre
func (lc *LibraryBookController) DeleteLibraryBook(c *gin.Context) {
	db := lc.DB
	idUser := getUserID(c)
	idLibraryParam := c.Param("id_library")
	idLibrary, err := uuid.Parse(idLibraryParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid library ID"})
		return
	}

	idBookParam := c.Param("id_book")
	idBook, err := uuid.Parse(idBookParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	repoLibraryBook := repository.NewLibraryBookRepository(db)
	success := repoLibraryBook.DeleteLibraryBook(idLibrary, idBook, idUser)
	if !success {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete library book"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Library book deleted successfully"})
}

var _ interfaces.LibraryBookControllerInterface = &LibraryBookController{}
