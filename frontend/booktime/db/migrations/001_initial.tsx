import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { SQLiteDatabase } from 'expo-sqlite';

// Fonction pour initialiser la base de données avec un fichier SQL
export const initDB = async (db: SQLiteDatabase) => {

    // init de toute les table 1 par 1
    initLibrary(db)
    initFormat(db)
    initAuthor(db)
    initGenre(db)
    initBook(db)
    initBookAuthor(db)
    initBookGenre(db)
    initState(db)
    initLibraryBook(db)
    initSharedLibrary(db)
    initUser(db)
};

export default initDB;

////////////////////////// Création des tables //////////////////////////

const initLibrary = async (db: SQLiteDatabase) => {
    try {
        db.execAsync(`
            CREATE TABLE IF NOT EXISTS library (
                id_library TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
                name VARCHAR(255) NOT NULL
            );
        `);
        console.log('Librairy initialized successfully');
    } catch (error) {
        console.error('Error initializing Librairy', error);
    }
}

const initFormat = async (db: SQLiteDatabase) => {
    try {
        db.execAsync(`
            CREATE TABLE IF NOT EXISTS formats (
                id_format TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
                name VARCHAR(100) NOT NULL
            );
        `);
        console.log('formats initialized successfully');
    } catch (error) {
        console.error('Error initializing formats', error);
    }
}

const initAuthor = async (db: SQLiteDatabase) => {
    try {
        db.execAsync(`
            CREATE TABLE IF NOT EXISTS author (
                id_author TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
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

const initGenre = async (db: SQLiteDatabase) => {
    try {
        db.execAsync(`
            CREATE TABLE IF NOT EXISTS genre (
                id_genre TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
                name VARCHAR(100) NOT NULL
            );
        `);
        console.log('genre initialized successfully');
    } catch (error) {
        console.error('Error initializing genre', error);
    }
}

const initBook = async (db: SQLiteDatabase) => {
    try {
        db.execAsync(`
            CREATE TABLE IF NOT EXISTS book (
                id_book TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                id_format TEXT,
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

const initBookAuthor = async (db: SQLiteDatabase) => {
    try {
        db.execAsync(`
            CREATE TABLE IF NOT EXISTS book_author (
                id_author TEXT,
                id_book TEXT,
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

const initBookGenre = async (db: SQLiteDatabase) => {
    try {
        db.execAsync(`
            CREATE TABLE IF NOT EXISTS book_genre (
                id_genre TEXT,
                id_book TEXT,
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

const initState = async (db: SQLiteDatabase) => {
    try {
        db.execAsync(`
            CREATE TABLE IF NOT EXISTS state (
                id_state TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
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

const initLibraryBook = async (db: SQLiteDatabase) => {
    try {
        db.execAsync(`
            CREATE TABLE IF NOT EXISTS library_book (
                id_library TEXT,
                id_book TEXT,
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

const initSharedLibrary = async (db: SQLiteDatabase) => {
    try {
        db.execAsync(`
            CREATE TABLE IF NOT EXISTS shared_library (
                id_user TEXT,
                id_library TEXT,
                PRIMARY KEY (id_user, id_library),
                FOREIGN KEY (id_library) REFERENCES library(id_library) ON DELETE CASCADE
            );
        `);
        console.log('shared_library initialized successfully');
    } catch (error) {
        console.error('Error initializing shared_library', error);
    }
}

const initUser = async (db: SQLiteDatabase) => {
    try {
        db.execAsync(`
            CREATE TABLE IF NOT EXISTS user (
                id_user TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
                username VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                email_verified BOOLEAN DEFAULT FALSE
                given_name VARCHAR(100),
                family_name VARCHAR(100),
            );
        `);
        console.log('user initialized successfully');
    } catch (error) {
        console.error('Error initializing user', error);
    }
}
