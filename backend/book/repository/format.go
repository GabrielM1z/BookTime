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

func (fr *FormatRepository) SelectFormats() []model.Format {
	var result []model.Format
	rows, err := fr.DB.Query("SELECT * FROM formats")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

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

func (fr *FormatRepository) SelectFormat(id uint) (model.Format, error) {
	var format model.Format
	stmt, err := fr.DB.Prepare("SELECT * FROM formats WHERE id_format = $1")
	if err != nil {
		log.Println(err)
		return format, err
	}
	defer stmt.Close()

	row := stmt.QueryRow(id)
	err = row.Scan(&format.IdFormat, &format.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			return format, nil // Pas de format trouvé
		}
		log.Println(err)
		return format, err // Erreur de lecture
	}

	return format, nil
}

func (fr *FormatRepository) UpdateFormat(id int, format model.Format) bool {
	query := `UPDATE formats SET name = $1 WHERE id_format = $2`

	_, err := fr.DB.Exec(query, format.Name, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

func (fr *FormatRepository) DeleteFormat(id int) bool {
	query := "DELETE FROM formats WHERE id_format = $1"

	_, err := fr.DB.Exec(query, id)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

var _ interfaces.FormatRepositoryInterface = &FormatRepository{}
