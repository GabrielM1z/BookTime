package controller

import (
	"database/sql"

	"booktime/model"
	"booktime/repository"

	"github.com/gin-gonic/gin"
)

type BookController struct {
	DB *sql.DB
}

func NewBookController(db *sql.DB) BookControllerInterface {
	return &BookController{DB: db}
}

// GetBook implements BookControllerInterface
func (m *BookController) GetBook(g *gin.Context) {
	db := m.DB
	repo_book := repository.NewBookRepository(db)
	get_book := repo_book.SelectBook()
	if get_book != nil {
		g.JSON(200, gin.H{"status": "success", "data": get_book, "msg": "get book successfully"})
	} else {
		g.JSON(200, gin.H{"status": "success", "data": nil, "msg": "get book successfully"})
	}
}

// InsertBook implements BookControllerInterface
func (m *BookController) InsertBook(g *gin.Context) {
	db := m.DB
	var post model.PostBook
	if err := g.ShouldBindJSON(&post); err == nil {
		repo_book := repository.NewBookRepository(db)
		insert := repo_book.InsertBook(post)
		if insert {
			g.JSON(200, gin.H{"status": "success", "msg": "insert book successfully"})
		} else {
			g.JSON(500, gin.H{"status": "failed", "msg": "insert book failed"})
		}
	} else {
		g.JSON(400, gin.H{"status": "success", "msg": err})
	}
}
