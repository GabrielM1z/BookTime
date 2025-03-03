import { SynchronisationProxy } from "@/controllers/SynchronisationProxy";
import { AuthorBook, CreateAuthorBookDto, DeleteAuthorBookDto } from "@/models/AuthorBook";
import { CrudJunctionRepository } from "@/types/repositories";
import { SQLiteDatabase } from 'expo-sqlite';

export interface AuthorBookRepository extends CrudJunctionRepository<AuthorBook> {
    create: (authorBook: CreateAuthorBookDto) => Promise<void>;
    createAll: (authorBooks: CreateAuthorBookDto[]) => Promise<void>;
    delete: (authorBook: DeleteAuthorBookDto) => Promise<void>;
}

export class LocalAuthorBookRepository implements AuthorBookRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationProxy;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationProxy) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async create(authorBook: CreateAuthorBookDto): Promise<void> {
        await this.db.runAsync(
            `INSERT OR IGNORE INTO book_author (id_author, id_book) 
            VALUES ($id_author, $id_book);`,
            {
                $id_author: authorBook.id_author,
                $id_book: authorBook.id_book,
            }
        );
    }

    async createAll(authorBooks: CreateAuthorBookDto[]): Promise<void> {
        const insertAuthorBook = await this.db.prepareAsync(
            `INSERT OR IGNORE INTO book_author (id_author, id_book) 
            VALUES ($id_author, $id_book);`,
        );

        try {
            for (const newAuthorBook of authorBooks) {
                await insertAuthorBook.executeAsync({
                    $id_author: newAuthorBook.id_author,
                    $id_book: newAuthorBook.id_book,
                });
            }
        } finally {
            await insertAuthorBook.finalizeAsync();
        }
    }

    async delete(authorBook: DeleteAuthorBookDto): Promise<void> {
        await this.db.runAsync(
            `DELETE FROM book_author 
            WHERE id_author = $id_author AND id_book = $id_book;`,
            {
                $id_author: authorBook.id_author,
                $id_book: authorBook.id_book,
            }
        );
    }

}

export class RemoteAuthorBookRepository implements AuthorBookRepository {
    async create(authorBook: CreateAuthorBookDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async createAll(authorBooks: CreateAuthorBookDto[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(authorBook: DeleteAuthorBookDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
