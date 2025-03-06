import { Library, CreateLibraryDto, UpdateLibraryDto, DeleteLibraryDto } from '@/models/Library';
import { SQLiteDatabase } from 'expo-sqlite';
import { SynchronisationProxy } from "@/controllers/SynchronisationProxy";
import { Context, CrudRepository } from '@/types/repositories';
import { BaseLocalRepository } from './base/BaseRepository';
import { syncAfterMethod, syncBeforeMethod } from '@/decorators/synchronisation';

export interface LibraryRepository extends CrudRepository<
    Library, CreateLibraryDto, UpdateLibraryDto, DeleteLibraryDto
> {
    getAllFromBook: (id_book: string) => Promise<Library[]>;
    getAllNotLibraryFromBook: (id_book: string) => Promise<Library[]>;
    getFirstFromBook: (idBook: string) => Promise<Library | null>
}

export class LocalLibraryRepository extends BaseLocalRepository<Library> implements LibraryRepository {
    private id_user: string;
    private sync: SynchronisationProxy;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationProxy) {
        super("library", db);
        this.id_user = id_user;
        this.sync = sync;
    }

    async get(id: string): Promise<Library> {
        const result = await this.db.getFirstAsync<Library>(
            `SELECT * FROM library 
            WHERE id_library == $id;`,
            { $id: id, }
        );
        return result!;
    }

    // @ts-ignore
    // @syncBeforeMethod()
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

    // @ts-ignore
    // @syncBeforeMethod()
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

    // @ts-ignore
    // @syncBeforeMethod()
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

    // @ts-ignore
    // @syncBeforeMethod()
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
        await this.create_base(library);
    }

    // @ts-ignore
    @syncAfterMethod()
    async update(library: UpdateLibraryDto): Promise<void> {
        await this.update_base(library, ["id_library"]);
    }

    // @ts-ignore
    @syncAfterMethod()
    async delete(library: DeleteLibraryDto): Promise<void> {
        await this.delete_base(library);
    }
}

export class RemoteLibraryRepository implements LibraryRepository {
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

    async update(library: UpdateLibraryDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(author: DeleteLibraryDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
