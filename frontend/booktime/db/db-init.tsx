import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

// Ouvre une connexion SQLite
const db = SQLite.openDatabaseSync('booktime.db');

// Fonction pour initialiser la base de données avec un fichier SQL
export const initDB = async () => {

	// init de toute les table 1 par 1
	initLibrary()
	initFormat()
	initAuthor()
	initGenre()
	initBook()
	initBookAuthor()
	initBookGenre()
	initState()
	initLibraryBook()
	initSharedLibrary()
};



////////////////////////// Création des tables //////////////////////////

const initLibrary = async () => {
	try {
		db.execAsync(`
			CREATE TABLE IF NOT EXISTS library (
				id_library INTEGER PRIMARY KEY AUTOINCREMENT,
				name VARCHAR(255) NOT NULL
			);
		`);
		console.log('Librairy initialized successfully');
	} catch (error) {
		console.error('Error initializing Librairy', error);
	}
}

const initFormat = async () => {
	try {
		db.execAsync(`
			CREATE TABLE IF NOT EXISTS formats (
				id_format INTEGER PRIMARY KEY AUTOINCREMENT,
				name VARCHAR(100) NOT NULL
			);
		`);
		console.log('formats initialized successfully');
	} catch (error) {
		console.error('Error initializing formats', error);
	}
}

const initAuthor = async () => {
	try {
		db.execAsync(`
			CREATE TABLE IF NOT EXISTS author (
				id_author INTEGER PRIMARY KEY AUTOINCREMENT,
				first_name VARCHAR(100) NOT NULL,
				last_name VARCHAR(100) NOT NULL,
				description TEXT
			);
		`);
		console.log('author initialized successfully');
	} catch (error) {
		console.error('Error initializing author', error);
	}
}

const initGenre = async () => {
	try {
		db.execAsync(`
			CREATE TABLE IF NOT EXISTS genre (
				id_genre INTEGER PRIMARY KEY AUTOINCREMENT,
				name VARCHAR(100) NOT NULL
			);
		`);
		console.log('genre initialized successfully');
	} catch (error) {
		console.error('Error initializing genre', error);
	}
}

const initBook = async () => {
	try {
		db.execAsync(`
			CREATE TABLE IF NOT EXISTS book (
				id_book INTEGER PRIMARY KEY AUTOINCREMENT,
				title VARCHAR(255) NOT NULL,
				description TEXT,
				id_format INT,
				publisher VARCHAR(255),
				publication_date DATE,
				page_number INT,
				language VARCHAR(50),
				cover_image_url VARCHAR(255),
				FOREIGN KEY (id_format) REFERENCES formats(id_format) ON DELETE CASCADE
			);
		`);
		console.log('book initialized successfully');
	} catch (error) {
		console.error('Error initializing book', error);
	}
}

const initBookAuthor = async () => {
	try {
		db.execAsync(`
			CREATE TABLE IF NOT EXISTS book_author (
				id_author INT,
				id_book INT,
				PRIMARY KEY (id_author, id_book),
				FOREIGN KEY (id_author) REFERENCES author(id_author) ON DELETE CASCADE,
				FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE
			);
		`);
		console.log('book_author initialized successfully');
	} catch (error) {
		console.error('Error initializing book_author', error);
	}
}

const initBookGenre = async () => {
	try {
		db.execAsync(`
			CREATE TABLE IF NOT EXISTS book_genre (
				id_genre INT,
				id_book INT,
				PRIMARY KEY (id_genre, id_book),
				FOREIGN KEY (id_genre) REFERENCES genre(id_genre) ON DELETE CASCADE,
				FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE
			);
		`);
		console.log('book_genre initialized successfully');
	} catch (error) {
		console.error('Error initializing book_genre', error);
	}
}

const initState = async () => {
	try {
		db.execAsync(`
			CREATE TABLE IF NOT EXISTS state (
				id_state INTEGER PRIMARY KEY AUTOINCREMENT,
				state VARCHAR(50),
				progression INT,
				read_count INT DEFAULT 0,
				last_read_date TIMESTAMP,
				id_user INT,
				id_book INT,
				is_available BOOLEAN DEFAULT FALSE,
				FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE
			);
		`);
		console.log('state initialized successfully');
	} catch (error) {
		console.error('Error initializing state', error);
	}
}

const initLibraryBook = async () => {
	try {
		db.execAsync(`
			CREATE TABLE IF NOT EXISTS library_book (
				id_library INT,
				id_book INT,
				PRIMARY KEY (id_library, id_book),
				FOREIGN KEY (id_library) REFERENCES library(id_library) ON DELETE CASCADE,
				FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE
			);
		`);
		console.log('library_book initialized successfully');
	} catch (error) {
		console.error('Error initializing library_book', error);
	}
}

const initSharedLibrary = async () => {
	try {
		db.execAsync(`
			CREATE TABLE IF NOT EXISTS shared_library (
				id_user INT,
				id_library INT,
				PRIMARY KEY (id_user, id_library),
				FOREIGN KEY (id_library) REFERENCES library(id_library) ON DELETE CASCADE
			);
		`);
		console.log('shared_library initialized successfully');
	} catch (error) {
		console.error('Error initializing shared_library', error);
	}
}


////////////////////////// Remplissage initial //////////////////////////

// TODO Création de l'utilisateur invité

// TODO Ajout des étagères de base (Like et Lu)