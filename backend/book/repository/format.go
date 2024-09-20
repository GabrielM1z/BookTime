package repository

import (
	"database/sql"
	"log"

	"book/model"
	"book/repository/interfaces"
)

type FormatRepository struct {
	DB *sql.DB
}

func NewFormatRepository(db *sql.DB) *FormatRepository {
	return &FormatRepository{DB: db}
}

func (fr *FormatRepository) InsertFormat(post model.PostFormat) bool {
	stmt, err := fr.DB.Prepare("INSERT INTO formats (name) VALUES ($1)")
	if err != nil {
		log.Println(err)
		return false
	}
	defer stmt.Close()
	_, err2 := stmt.Exec(post.Name)
	if err2 != nil {
		log.Println(err2)
		return false
	}
	return true
}

func (fr *FormatRepository) SelectFormat() []model.Format {
	var result []model.Format
	rows, err := fr.DB.Query("SELECT * FROM formats")
	if err != nil {
		log.Println(err)
		return nil
	}
	for rows.Next() {
		var (
			id   uint
			name string
		)
		err := rows.Scan(&id, &name)
		if err != nil {
			log.Println(err)
		} else {
			format := model.Format{IdFormat: id, Name: name}
			result = append(result, format)
		}
	}
	return result
}

var _ interfaces.FormatRepositoryInterface = &FormatRepository{}
