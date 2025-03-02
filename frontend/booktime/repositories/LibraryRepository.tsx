import { Library, CreateLibraryDto, LibraryWithBooks, LibraryWithBooksMin } from '@/models/Library';
import { SQLiteDatabase } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { Book, BookMinInfos } from '@/models/Book';
import { SynchronisationController } from '@/controllers/SynchronisationController';

export interface LibraryRepository {
    getAll: () => Promise<Library[]>;
    get: (id: string) => Promise<Library | null>;
    getFirst: () => Promise<Library | null>;
    create: (library: CreateLibraryDto) => Promise<string>;
    delete: (id: string) => Promise<void>;
    getAllFromBook: (id_book: string) => Promise<Library[]>;
    getAllNotLibraryFromBook: (id_book: string) => Promise<Library[]>;
    getLastInsertedId: () => Promise<string | null>
    getFirstFromBook: (idBook: string) => Promise<Library | null>
}

export class LocalLibraryRepository implements LibraryRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationController;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationController) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async getLastInsertedId(): Promise<string> {
        const result = await this.db.getFirstAsync<Library>(
            `SELECT * FROM library ORDER BY rowid DESC LIMIT 1;`,
        );

        return (result as Library).id_library;
    }

    async getAll(): Promise<Library[]> {
        let allRows = await this.db.getAllAsync<Library>(
            `SELECT * FROM library 
            JOIN shared_library ON library.id_library = shared_library.id_library
            WHERE shared_library.id_user = $id_user`,
            { $id_user: this.id_user }
        );
        return allRows;
    }

    async get(id: string): Promise<Library | null> {
        const result = await this.db.getFirstAsync<Library>(
            'SELECT * FROM library WHERE id_library == $id',
            { $id: id, }
        );

        return result!;
    }

    async getFirst(): Promise<Library> {
        const result = await this.db.getFirstAsync<Library>(
            'SELECT * FROM library LIMIT 1;'
        );

        return result!;
    }

    async create(library: CreateLibraryDto): Promise<string> {
        await this.db.runAsync(
            'INSERT INTO library (name) VALUES ($name);',
            { $name: library.name }
        )
        return await this.getLastInsertedId();
    }

    async delete(id: string): Promise<void> {
        await this.db.runAsync(
            'DELETE FROM library_book WHERE id_library = $id',
            { $id: id }
        );
    }

    async getAllFromBook(id_book: string): Promise<Library[]> {
        const libraries = this.db.getAllAsync<Library>(
            `SELECT library.*
            FROM library
            JOIN library_book ON library.id_library = library_book.id_library
            JOIN book ON library_book.id_book = book.id_book
            WHERE book.id_book = $id_book; `,
            { $id_book: id_book }
        );

        return libraries;
    }

    async getAllNotLibraryFromBook(id_book: string): Promise<Library[]> {
        const libraries = this.db.getAllAsync<Library>(
            `SELECT library.*
            FROM library
            WHERE library.id_library NOT IN (
                SELECT library.id_library
                FROM library
                JOIN library_book ON library.id_library = library_book.id_library
                JOIN book ON library_book.id_book = book.id_book
                WHERE book.id_book = $id_book
            ); `,
            { $id_book: id_book }
        );

        return libraries;
    }

    async getFirstFromBook(idBook: string): Promise<Library | null> {
        const result = await this.db.getFirstAsync<Library>(
            `SELECT library.*
            FROM library
            JOIN library_book ON library.id_library = library_book.id_library
            WHERE library_book.id_book = $id_book
            LIMIT 1;`,
            { $id_book: idBook }
        );

        return result;
    }

}

export class RemoteLibraryRepository implements LibraryRepository {

    async getLastInsertedId(): Promise<string | null> {
        return ""
    }

    async getAll(): Promise<Library[]> {
        return [];
    }

    async get(id: string): Promise<Library | null> {
        return null;
    }

    async getFirst(): Promise<Library> {
        return {} as Library;
    }

    async getFirstFromBook(idBook: string): Promise<Library | null> {
        return null;
    }

    async create(library: CreateLibraryDto): Promise<string> {
        return "";
    }

    async delete(id: string): Promise<void> {
        return;
    }

    async getAllFromBook(id_book: string): Promise<Library[]> {
        return [];
    }

    async getAllNotLibraryFromBook(id_book: string): Promise<Library[]> {
        return [];
    }
}
