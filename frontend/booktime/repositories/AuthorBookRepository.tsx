import { AuthorBook, CreateAuthorBookDto, DeleteAuthorBookDto, UpdateAuthorBookDto } from "@/models/AuthorBook";
import { CrudRepository } from "@/types/repositories";
import { SQLiteDatabase } from 'expo-sqlite';
import { BaseLocalRepository } from "./base/BaseRepository";

export interface AuthorBookRepository extends CrudRepository<
    AuthorBook, CreateAuthorBookDto, UpdateAuthorBookDto, DeleteAuthorBookDto
> { }

export class LocalAuthorBookRepository extends BaseLocalRepository<AuthorBook> implements AuthorBookRepository {
    private id_user: string;

    constructor(db: SQLiteDatabase, id_user: string) {
        super("book_author", db);
        this.id_user = id_user;
    }

    async get(id: string): Promise<AuthorBook> {
        throw new Error("Method not implemented.")
    }

    async create(authorBook: CreateAuthorBookDto): Promise<void> {
        await this.create_base(authorBook);
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

    async update(authorBook: UpdateAuthorBookDto): Promise<void> {
        await this.update_base(authorBook, ["id_author", "id_book"]);
    }

    async delete(authorBook: DeleteAuthorBookDto): Promise<void> {
        await this.delete_base(authorBook);
    }
}

export class RemoteAuthorBookRepository implements AuthorBookRepository {
    async get(id: string): Promise<AuthorBook> {
        throw new Error("Method not implemented.");
    }

    async create(authorBook: CreateAuthorBookDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async createAll(authorBooks: CreateAuthorBookDto[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async update(authorBook: UpdateAuthorBookDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(authorBook: DeleteAuthorBookDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
