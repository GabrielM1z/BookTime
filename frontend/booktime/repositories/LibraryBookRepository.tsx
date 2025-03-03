import { SynchronisationProxy } from "@/controllers/SynchronisationProxy";
import { CreateLibraryBookDto, DeleteLibraryBookDto, LibraryBook } from "@/models/LibraryBook";
import { CrudJunctionRepository } from "@/types/repositories";
import { SQLiteDatabase } from 'expo-sqlite';

export interface LibraryBookRepository extends CrudJunctionRepository<LibraryBook> {
    create: (libraryBook: CreateLibraryBookDto) => Promise<void>;
    createAll: (libraryBooks: CreateLibraryBookDto[]) => Promise<void>;
    delete(libraryBook: DeleteLibraryBookDto): Promise<void>
    deleteAll(libraryBooks: DeleteLibraryBookDto[]): Promise<void>
}

export class LocalLibraryBookRepository implements LibraryBookRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationProxy;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationProxy) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async create(newLibraryBook: CreateLibraryBookDto): Promise<void> {
        await this.db.runAsync(
            `INSERT OR IGNORE INTO library_book (id_library, id_book) 
            VALUES ($id_library, $id_book);`,
            {
                $id_library: newLibraryBook.id_library,
                $id_book: newLibraryBook.id_book,
            }
        );
    }

    async createAll(libraryBooks: CreateLibraryBookDto[]): Promise<void> {
        const insertLibraryBook = await this.db.prepareAsync(
            `INSERT OR IGNORE INTO library_book (id_library, id_book) 
            VALUES ($id_library, $id_book);`,
        );
        try {
            libraryBooks.forEach(async (libraryBook) => {
                await insertLibraryBook.executeAsync({
                    $id_library: libraryBook.id_library,
                    $id_book: libraryBook.id_book,
                });
            });
        } finally {
            await insertLibraryBook.finalizeAsync();
        }
    }

    async delete(libraryBook: DeleteLibraryBookDto): Promise<void> {
        await this.db.runAsync(
            `DELETE FROM library_book 
            WHERE id_library == $id_library 
            AND id_book == $id_book;`,
            {
                $id_library: libraryBook.id_library,
                $id_book: libraryBook.id_book,
            }
        );
    }

    async deleteAll(libraryBooks: DeleteLibraryBookDto[]): Promise<void> {
        const deleteLibraryBook = await this.db.prepareAsync(
            `DELETE FROM library_book 
            WHERE id_library == $id_library 
            AND id_book == $id_book;`,
        );
        try {
            libraryBooks.forEach(async (libraryBook) => {
                await deleteLibraryBook.executeAsync({
                    $id_library: libraryBook.id_library,
                    $id_book: libraryBook.id_book,
                });
            });
        } finally {
            await deleteLibraryBook.finalizeAsync();
        }
    }
}

export class RemoteLibraryBookRepository implements LibraryBookRepository {
    constructor() { }

    async create(newLibraryBook: CreateLibraryBookDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async createAll(listNewLibraryBook: CreateLibraryBookDto[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(newLibraryBook: DeleteLibraryBookDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async deleteAll(listNewLibraryBook: DeleteLibraryBookDto[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
}