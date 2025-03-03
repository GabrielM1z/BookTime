import { Library, CreateLibraryDto, UpdateLibraryDto } from '@/models/Library';
import { SQLiteDatabase } from 'expo-sqlite';
import { SynchronisationProxy } from "@/controllers/SynchronisationProxy";
import { CrudRepository } from '@/types/repositories';
import { randomUUID } from "expo-crypto";

export interface LibraryRepository extends CrudRepository<Library> {
    get: (id: string) => Promise<Library>;
    getAll: () => Promise<Library[]>;
    getAllFromBook: (id_book: string) => Promise<Library[]>;
    getAllNotLibraryFromBook: (id_book: string) => Promise<Library[]>;
    getLastInsertedId: () => Promise<string | null>
    getFirstFromBook: (idBook: string) => Promise<Library | null>
    getFirst: () => Promise<Library | null>;
    create: (library: CreateLibraryDto) => Promise<void>;
    update: (id: string, library: CreateLibraryDto) => Promise<void>;
    delete: (id: string) => Promise<void>;
}

export class LocalLibraryRepository implements LibraryRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationProxy;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationProxy) {
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

    async get(id: string): Promise<Library> {
        const result = await this.db.getFirstAsync<Library>(
            `SELECT * FROM library 
            WHERE id_library == $id;`,
            { $id: id, }
        );
        return result!;
    }

    async getAll(): Promise<Library[]> {
        let allRows = await this.db.getAllAsync<Library>(
            `SELECT * FROM library 
            JOIN shared_library ON library.id_library = shared_library.id_library
            WHERE shared_library.id_user = $id_user;`,
            { $id_user: this.id_user }
        );
        return allRows;
    }

    async getFirst(): Promise<Library> {
        const result = await this.db.getFirstAsync<Library>(
            `SELECT * FROM library LIMIT 1;`
        );
        return result!;
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

    async create(library: CreateLibraryDto): Promise<void> {
        await this.db.runAsync(
            `INSERT INTO library (id_library, name) 
            VALUES ($id_library, $name);`,
            { $id_library: randomUUID(), $name: library.name }
        );
    }

    async update(id: string, library: UpdateLibraryDto): Promise<void> {
        await this.db.runAsync(
            `UPDATE library SET name = $name 
            WHERE id_library = $id;`,
            { $id: id, $name: library.name }
        );
    }

    async delete(id: string): Promise<void> {
        await this.db.runAsync(
            `DELETE FROM library_book 
            WHERE id_library = $id`,
            { $id: id }
        );
    }
}

export class RemoteLibraryRepository implements LibraryRepository {
    async getLastInsertedId(): Promise<string | null> {
        throw new Error("Method not implemented.");
    }

    async getAll(): Promise<Library[]> {
        throw new Error("Method not implemented.");
    }

    async get(id: string): Promise<Library> {
        throw new Error("Method not implemented.");
    }

    async getFirst(): Promise<Library> {
        throw new Error("Method not implemented.");
    }

    async getFirstFromBook(idBook: string): Promise<Library | null> {
        throw new Error("Method not implemented.");
    }

    async getAllFromBook(id_book: string): Promise<Library[]> {
        throw new Error("Method not implemented.");
    }

    async getAllNotLibraryFromBook(id_book: string): Promise<Library[]> {
        throw new Error("Method not implemented.");
    }

    async create(library: CreateLibraryDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, library: UpdateLibraryDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
