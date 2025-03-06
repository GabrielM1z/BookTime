import { SynchronisationProxy } from "@/controllers/SynchronisationProxy";
import { CreateLibraryBookDto, DeleteLibraryBookDto, LibraryBook, UpdateLibraryBookDto } from "@/models/LibraryBook";
import { Context, CrudRepository } from "@/types/repositories";
import { SQLiteDatabase } from 'expo-sqlite';
import { BaseLocalRepository } from "./base/BaseRepository";
import { syncAfterMethod } from "@/decorators/synchronisation";

export interface LibraryBookRepository extends CrudRepository<
    LibraryBook, CreateLibraryBookDto, UpdateLibraryBookDto, DeleteLibraryBookDto
> { }

export class LocalLibraryBookRepository extends BaseLocalRepository<LibraryBook> implements LibraryBookRepository {
    private id_user: string;
    private sync: SynchronisationProxy;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationProxy) {
        super("library_book", db);
        this.id_user = id_user;
        this.sync = sync;
    }

    async get(id: string): Promise<LibraryBook> {
        throw new Error("Method not implemented.");
    }

    // @ts-ignore
    @syncAfterMethod()
    async create(libraryBook: CreateLibraryBookDto): Promise<void> {
        await this.create_base(libraryBook);
    }

    // @ts-ignore
    @syncAfterMethod()
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

    // @ts-ignore
    @syncAfterMethod()
    async update(libraryBook: UpdateLibraryBookDto): Promise<void> {
        await this.update_base(libraryBook, ["id_library", "id_book"]);
    }

    // @ts-ignore
    @syncAfterMethod()
    async delete(libraryBook: DeleteLibraryBookDto): Promise<void> {
        await this.delete_base(libraryBook);
    }

    // @ts-ignore
    @syncAfterMethod()
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
    async get(id: string): Promise<LibraryBook> {
        throw new Error("Method not implemented.");
    }

    async create(libraryBook: CreateLibraryBookDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async createAll(libraryBooks: CreateLibraryBookDto[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async update(libraryBook: UpdateLibraryBookDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(libraryBook: DeleteLibraryBookDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async deleteAll(libraryBooks: DeleteLibraryBookDto[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
