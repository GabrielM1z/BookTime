import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('booktime.db');


export const truncateDB = async () => {

	// truncate de toutes les tables
    truncateAll()
};

export const dropDB = async () => {

	// suppression de toutes les tables
    dropAll()
};


const truncateAll = async () => {
	try {
		db.execAsync(`
			PRAGMA foreign_keys = OFF;
            DELETE FROM shared_library;
            DELETE FROM library_book;
            DELETE FROM state;
            DELETE FROM book_genre;
            DELETE FROM book_author;
            DELETE FROM book;
            DELETE FROM genre;
            DELETE FROM author;
            DELETE FROM formats;
            DELETE FROM library;
            PRAGMA foreign_keys = ON;
		`);
		console.log('Truncate All DB successfully');
	} catch (error) {
		console.error('Error during Truncate DB', error);
	}
}


const dropAll = async () => {
	try {
		db.execAsync(`
			PRAGMA foreign_keys = OFF;
            DROP TABLE IF EXISTS shared_library;
            DROP TABLE IF EXISTS library_book;
            DROP TABLE IF EXISTS state;
            DROP TABLE IF EXISTS book_genre;
            DROP TABLE IF EXISTS book_author;
            DROP TABLE IF EXISTS book;
            DROP TABLE IF EXISTS genre;
            DROP TABLE IF EXISTS author;
            DROP TABLE IF EXISTS formats;
            DROP TABLE IF EXISTS library;
            PRAGMA foreign_keys = ON;
		`);
		console.log('Truncate All DB successfully');
	} catch (error) {
		console.error('Error during Truncate DB', error);
	}
}