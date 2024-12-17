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
	initAction(db)

	// init des trigger
	initTrigger(db)

	// init library de base
	initBaseData(db)
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
				id_book VARCHAR(13) PRIMARY KEY,
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
				id_book VARCHAR(13),
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
				id_book VARCHAR(13),
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
				state VARCHAR(50),
				progression INT,
				read_count INT DEFAULT 0,
				last_read_date TIMESTAMP,
				id_user TEXT PRIMARY KEY,
				id_book VARCHAR(13) PRIMARY KEY,
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
				id_book VARCHAR(13),
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


const initAction = async (db: SQLiteDatabase) => {
	try {
		db.execAsync(`
			CREATE TABLE IF NOT EXISTS action (
				id_action TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
				id_user TEXT,
				table_name VARCHAR(50),
				date TIMESTAMP,
				type VARCHAR(50),
				action JSON,
				executed_by VARCHAR(6)
			);
		`);
		console.log('Action initialized successfully');
	} catch (error) {
		console.error('Error initializing Action', error);
	}
}






////////////////////////// Création des TRIGGER //////////////////////////

// création des trigger
const initTrigger = async (db: SQLiteDatabase) => {

	// State
	initTriggerInsertState(db);
	initTriggerUpdateState(db);
	initTriggerDeleteState(db);

	// Library
	initTriggerInsertLibrary(db);
	initTriggerUpdateLibrary(db);
	initTriggerDeleteLibrary(db);

	// Library Book
	initTriggerInsertLibraryBook(db);
	initTriggerDeleteLibraryBook(db);

	// Shared Library
	initTriggerInsertSharedLibrary(db);
	initTriggerDeleteSharedLibrary(db);
}




///////////// State : CUD /////////////

/**
 * Initialisation du trigger de'insertion d'un state
 * @param db 
 */
const initTriggerInsertState = async (db: SQLiteDatabase) => {
	try {
		db.execAsync(`
			CREATE TRIGGER IF NOT EXISTS trg_state_insert
			AFTER INSERT
			ON state
			FOR EACH ROW
			BEGIN
				INSERT INTO Action (
					id_action, 
					table_name, 
					date, 
					type, 
					action, 
					executed_by
				)
				VALUES (
					lower(hex(randomblob(16))),
					'STATE', 
					CURRENT_TIMESTAMP, 
					'INSERT', 
					json_object(
						'id_state', NEW.id_state,
						'state', NEW.state,
						'progression', NEW.progression,
						'read_count', NEW.read_count,
						'last_read_date', NEW.last_read_date,
						'id_user', NEW.id_user,
						'id_book', NEW.id_book,
						'is_available', NEW.is_available
					), 
					'CLIENT'
				);
			END;
		`);
		console.log('Trigger state insert initialized successfully');
	} catch (error) {
		console.error('Error initializing trigger state insert', error);
	}
}

/**
 * Initialisation du trigger de mise à jour d'un state
 * @param db 
 */
const initTriggerUpdateState = async (db: SQLiteDatabase) => {
	try {
		db.execAsync(`
			CREATE TRIGGER IF NOT EXISTS trg_state_update
			AFTER UPDATE
			ON state
			FOR EACH ROW
			BEGIN
				INSERT INTO Action (
					id_action, 
					table_name, 
					date, 
					type, 
					action, 
					executed_by
				)
				VALUES (
					lower(hex(randomblob(16))),
					'STATE', 
					CURRENT_TIMESTAMP, 
					'INSERT', 
					json_object(
						'id_state', NEW.id_state,

						CASE WHEN OLD.state != NEW.state THEN 'state' ELSE NULL END, 
						CASE WHEN OLD.state != NEW.state THEN NEW.state ELSE NULL END,

						CASE WHEN OLD.progression != NEW.progression THEN 'progression' ELSE NULL END, 
						CASE WHEN OLD.progression != NEW.progression THEN NEW.progression ELSE NULL END,

						CASE WHEN OLD.read_count != NEW.read_count THEN 'read_count' ELSE NULL END, 
						CASE WHEN OLD.read_count != NEW.read_count THEN NEW.read_count ELSE NULL END,

						CASE WHEN OLD.last_read_date != NEW.last_read_date THEN 'last_read_date' ELSE NULL END, 
						CASE WHEN OLD.last_read_date != NEW.last_read_date THEN NEW.last_read_date ELSE NULL END,

						CASE WHEN OLD.id_user != NEW.id_user THEN 'id_user' ELSE NULL END, 
						CASE WHEN OLD.id_user != NEW.id_user THEN NEW.id_user ELSE NULL END,
						
						CASE WHEN OLD.id_book != NEW.id_book THEN 'id_book' ELSE NULL END, 
						CASE WHEN OLD.id_book != NEW.id_book THEN NEW.id_book ELSE NULL END,

						CASE WHEN OLD.is_available != NEW.is_available THEN 'is_available' ELSE NULL END, 
						CASE WHEN OLD.is_available != NEW.is_available THEN NEW.is_available ELSE NULL END
					), 
					'CLIENT'
				);
			END;
		`);
		console.log('Trigger state update initialized successfully');
	} catch (error) {
		console.error('Error initializing trigger state update', error);
	}
}

/**
 * Initialisation du trigger de suppression d'un state
 * @param db 
 */
const initTriggerDeleteState = async (db: SQLiteDatabase) => {
	try {
		db.execAsync(`
			CREATE TRIGGER IF NOT EXISTS trg_state_delete
			AFTER DELETE
			ON state
			FOR EACH ROW
			BEGIN
				INSERT INTO Action (
					id_action, 
					table_name, 
					date, 
					type, 
					action, 
					executed_by
				)
				VALUES (
					lower(hex(randomblob(16))),
					'STATE', 
					CURRENT_TIMESTAMP, 
					'DELETE', 
					json_object(
						'id_state', OLD.id_state
					), 
					'CLIENT'
				);
			END;
		`);
		console.log('Trigger state delete initialized successfully');
	} catch (error) {
		console.error('Error initializing trigger state delete', error);
	}
}


///////////// Library : CUD /////////////

/**
 * Initialisation du trigger d'insertion d'une library
 * @param db 
 */
const initTriggerInsertLibrary = async (db: SQLiteDatabase) => {
	try {
		db.execAsync(`
			CREATE TRIGGER IF NOT EXISTS trg_library_insert
			AFTER INSERT
			ON library
			FOR EACH ROW
			BEGIN
				INSERT INTO Action (
					table_name, 
					date, 
					type, 
					action, 
					executed_by
				)
				VALUES (
					'LIBRARY', 
					CURRENT_TIMESTAMP, 
					'INSERT', 
					json_object(
						'id_library', NEW.id_library,
						'name', NEW.name
					), 
					'CLIENT'
				);
			END;
		`);
		console.log('Trigger library insert initialized successfully');
	} catch (error) {
		console.error('Error initializing trigger library insert', error);
	}
}


/**
 * Initialisation du trigger de mise à jour d'un state
 * @param db 
 */
const initTriggerUpdateLibrary = async (db: SQLiteDatabase) => {
	try {
		db.execAsync(`
			CREATE TRIGGER IF NOT EXISTS trg_library_update
			AFTER UPDATE
			ON library
			FOR EACH ROW
			BEGIN
				INSERT INTO Action (
					id_action, 
					table_name, 
					date, 
					type, 
					action, 
					executed_by
				)
				VALUES (
					lower(hex(randomblob(16))),
					'LIBRARY', 
					CURRENT_TIMESTAMP, 
					'UPDATE', 
					json_object(
						'id_library', NEW.id_library,
						CASE WHEN OLD.name != NEW.name THEN 'name' ELSE NULL END, 
						CASE WHEN OLD.name != NEW.name THEN NEW.name ELSE NULL END
					), 
					'CLIENT'
				);
			END;
		`);
		console.log('Trigger library update initialized successfully');
	} catch (error) {
		console.error('Error initializing trigger library update', error);
	}
}

/**
 * Initialisation du trigger de suppression d'une library
 * @param db 
 */
const initTriggerDeleteLibrary = async (db: SQLiteDatabase) => {
	try {
		db.execAsync(`
			CREATE TRIGGER IF NOT EXISTS trg_library_delete
			AFTER DELETE
			ON library
			FOR EACH ROW
			BEGIN
				INSERT INTO Action (
					id_action, 
					table_name, 
					date, 
					type, 
					action, 
					executed_by
				)
				VALUES (
					lower(hex(randomblob(16))),
					'LIBRARY', 
					CURRENT_TIMESTAMP, 
					'DELETE', 
					json_object(
						'id_library', OLD.id_library
					), 
					'CLIENT'
				);
			END;
		`);
		console.log('Trigger state delete initialized successfully');
	} catch (error) {
		console.error('Error initializing trigger state delete', error);
	}
}


///////////// SharedLibrary : CD /////////////

/**
 * Initialisation du trigger d'insertion d'une Library partagé
 * @param db 
 */
const initTriggerInsertSharedLibrary = async (db: SQLiteDatabase) => {
	try {
		db.execAsync(`
			CREATE TRIGGER IF NOT EXISTS trg_shared_library_insert
			AFTER INSERT
			ON shared_library
			FOR EACH ROW
			BEGIN
				INSERT INTO Action (
					id_action, 
					table_name, 
					date, 
					type, 
					action, 
					executed_by
				)
				VALUES (
					lower(hex(randomblob(16))),
					'SHARED_LIBRARY', 
					CURRENT_TIMESTAMP, 
					'INSERT', 
					json_object(
						'id_user', NEW.id_user,
						'id_library', NEW.id_library
					), 
					'CLIENT'
				);
			END;
		`);
		console.log('Trigger shared_library insert initialized successfully');
	} catch (error) {
		console.error('Error initializing trigger shared_library insert', error);
	}
}

/**
 * Initialisation du trigger de suppression d'une Library partagé
 * @param db 
 */
const initTriggerDeleteSharedLibrary = async (db: SQLiteDatabase) => {
	try {
		db.execAsync(`
			CREATE TRIGGER IF NOT EXISTS trg_shared_library_delete
			AFTER DELETE
			ON shared_library
			FOR EACH ROW
			BEGIN
				INSERT INTO Action (
					id_action, 
					table_name, 
					date, 
					type, 
					action, 
					executed_by
				)
				VALUES (
					lower(hex(randomblob(16))),
					'SHARED_LIBRARY', 
					CURRENT_TIMESTAMP, 
					'DELETE', 
					json_object(
						'id_user', OLD.id_user,
						'id_library', OLD.id_library
					), 
					'CLIENT'
				);
			END;
		`);
		console.log('Trigger shared_library delete initialized successfully');
	} catch (error) {
		console.error('Error initializing trigger shared_library delete', error);
	}
}


///////////// LibraryBook : CD /////////////

/**
 * Initialisation du trigger d'insertion d'une library book
 * @param db 
 */
const initTriggerInsertLibraryBook = async (db: SQLiteDatabase) => {
	try {
		db.execAsync(`
			CREATE TRIGGER IF NOT EXISTS trg_library_book_insert
			AFTER INSERT
			ON library_book
			FOR EACH ROW
			BEGIN
				INSERT INTO Action (
					id_action, 
					table_name, 
					date, 
					type, 
					action, 
					executed_by
				)
				VALUES (
					lower(hex(randomblob(16))),
					'LIBRARY_BOOK', 
					CURRENT_TIMESTAMP, 
					'INSERT', 
					json_object(
						'id_library', NEW.id_library,
						'id_book', NEW.id_book
					), 
					'CLIENT'
				);
			END;
		`);
		console.log('Trigger library_book insert initialized successfully');
	} catch (error) {
		console.error('Error initializing trigger library_book insert', error);
	}
}


/**
 * Initialisation du trigger de suppression d'une library book
 * @param db 
 */
const initTriggerDeleteLibraryBook = async (db: SQLiteDatabase) => {
	try {
		db.execAsync(`
			CREATE TRIGGER IF NOT EXISTS trg_library_book_delete
			AFTER DELETE
			ON library_book
			FOR EACH ROW
			BEGIN
				INSERT INTO Action (
					id_action, 
					table_name, 
					date, 
					type, 
					action, 
					executed_by
				)
				VALUES (
					lower(hex(randomblob(16))),
					'LIBRARY_BOOK', 
					CURRENT_TIMESTAMP, 
					'DELETE', 
					json_object(
						'id_library', OLD.id_library,
						'id_book', OLD.id_book
					), 
					'CLIENT'
				);
			END;
		`);
		console.log('Trigger library_book delete initialized successfully');
	} catch (error) {
		console.error('Error initializing trigger library_book delete', error);
	}
}




////////////////////////// Insertions des données initiales //////////////////////////


/**
 * Insertions des données initiales
 * @param db 
 */
const initBaseData = async (db: SQLiteDatabase) => {

	initBaseLibraryData(db);
	
}

/**
 * Insertion des library de base
 * @param db 
 */
const initBaseLibraryData = async (db: SQLiteDatabase) => {

	// library de base
	const libs = [
		"Like",
		"A voir"
	]

	// création des library de base
	libs.forEach(async element => {
		try {
			const statement = db.prepareAsync(
				'INSERT INTO library (name) VALUES ($name);'
			);
	
			(await statement).executeAsync({
				$name: element
			});

			console.log('Library ', element, ' successfully added');
		} catch (error) {
			console.error('Error during the add of library', element, ' : ', error);
		}
	});
	
}