import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('booktime.db');



////////////////////////// REQUETE SELECT //////////////////////////

// Fonction pour recupérer tout les livres
export const getAllBooks = async () => 
{
	try {
        let allRows = await db.getAllAsync('SELECT * FROM book');
        console.log(allRows)
        return allRows;
	} catch (error) {
		console.error('Error get all books', error);
	}
    return [];
}

// Fonction pour recupérer tout les livres avec toutes les infos
export const getAllBooksWithAllInfo = async () => 
{
	try {
		let allRows = await db.getAllAsync(`
			SELECT 
				book.id_book,
				book.title,
				book.description,
				book.publisher,
				book.publication_date,
				book.page_number,
				book.language,
				book.cover_image_url,
				format.name AS format_name,
				genre.name AS genre_name,
				author.first_name || ' ' || author.last_name AS author_name,
				state.state AS book_state,
				state.progression,
				state.read_count,
				state.last_read_date,
				state.is_available
			FROM book
			LEFT JOIN format ON book.id_format = format.id_format
			LEFT JOIN book_genre ON book.id_book = book_genre.id_book
			LEFT JOIN genre ON book_genre.id_genre = genre.id_genre
			LEFT JOIN book_author ON book.id_book = book_author.id_book
			LEFT JOIN author ON book_author.id_author = author.id_author
			LEFT JOIN state ON book.id_book = state.id_book;
		`);
		console.log(allRows)
		return allRows;
	} catch (error) {
		console.error('Error get all books with all info', error);
	}
	return [];
}

// fonction pour récupérer tout les livres d'1 seule étagère
export const getBooksFromLibrary = async (idLibrary: any) => 
{
	const statement = await db.prepareAsync(`
		SELECT 
			library.name AS library_name,
			book.id_book,
			book.title,
			book.description,
			book.publisher,
			book.publication_date,
			book.page_number,
			book.language,
			book.cover_image_url,
			format.name AS format_name,
			genre.name AS genre_name,
			author.first_name || ' ' || author.last_name AS author_name,
			state.state AS book_state,
			state.progression,
			state.read_count,
			state.last_read_date,
			state.is_available
		FROM library
		JOIN library_book ON library.id_library = library_book.id_library
		JOIN book ON library_book.id_book = book.id_book
		LEFT JOIN format ON book.id_format = format.id_format
		LEFT JOIN book_genre ON book.id_book = book_genre.id_book
		LEFT JOIN genre ON book_genre.id_genre = genre.id_genre
		LEFT JOIN book_author ON book.id_book = book_author.id_book
		LEFT JOIN author ON book_author.id_author = author.id_author
		LEFT JOIN state ON book.id_book = state.id_book
		WHERE library.id_library = $idLibrary;
	`);

	try {
		let result = await statement.executeAsync({ 
			$idLibrary: idLibrary
		});
		console.log("result : ", result)        
	} catch (error) {
		console.error('Error insert into Librairy', error);
	}


	return [];
}

// fonction pour récupérer tout les livres par type