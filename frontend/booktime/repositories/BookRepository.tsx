import { SQLiteDatabase } from 'expo-sqlite';
import { Book, BookInfosServeur, BookMinInfos, CreateBookDto, DeleteBookDto, UpdateBookDto } from '@/models/Book';
import { formatColumns } from '@/helpers';
import { api } from "@/services/axios"
import { SynchronisationProxy } from '@/controllers/SynchronisationProxy';
import { CrudRepository } from '@/types/repositories';
import { BaseLocalRepository } from './base/BaseRepository';

export interface BookRepository extends CrudRepository<
    Book, CreateBookDto, UpdateBookDto, DeleteBookDto
> {
    get: (id: string, columns?: (keyof Book)[]) => Promise<Book>;
    getAll: (columns?: (keyof Book)[]) => Promise<Book[]>;
    getAllFromLibrary: (id_lib: string) => Promise<Book[]>
}

export class LocalBookRepository extends BaseLocalRepository<Book> implements BookRepository {
    private id_user: string;

    constructor(db: SQLiteDatabase, id_user: string) {
        super("book", db);
        this.id_user = id_user;
    }

    async get(id: string, columns: (keyof Book)[] = []): Promise<Book> {
        const args = formatColumns(columns, ['id_book']);
        const result = await this.db.getFirstAsync<Book>(
            `SELECT ${args} FROM book WHERE id_book == $id`,
            { $id: id }
        );
        return result!;
    }

    async getAll(columns: (keyof Book)[] = []): Promise<Book[]> {
        try {
            const args = formatColumns(columns, ['book.id_book']);
            let allRows = await this.db.getAllAsync<Book>(
                `SELECT ${args} FROM book
                LEFT JOIN state ON state.id_book = book.id_book
                WHERE state.id_user = $id_user`,
                { $id_user: this.id_user }
            );
            console.log("allrows: ", allRows);

            return allRows;

        } catch (error) {
            console.log("getAll", error)
            return []
        }
    }

    async getAllMin(): Promise<BookMinInfos[]> {
        let allRows = await this.db.getAllAsync<BookMinInfos>(
            'SELECT id_book, title, cover_image_url FROM book'
        );
        return allRows;
    }

    async getAllFromLibrary(id_library: string): Promise<Book[]> {
        let allRows = await this.db.getAllAsync<Book>(
            'SELECT * ' +
            'FROM book ' +
            'JOIN library_book ON book.id_book = library_book.id_book ' +
            'JOIN library ON library_book.id_library = library.id_library ' +
            'WHERE library_book.id_library == $id_library ',
            { $id_library: id_library }
        );
        return allRows;
    }

    async create(book: CreateBookDto): Promise<void> {
        await this.create_base(book);
    }

    async update(book: UpdateBookDto): Promise<void> {
        await this.update_base(book, ["id_book"]);
    }

    async delete(book: DeleteBookDto): Promise<void> {
        await this.delete_base(book);
    }
}

export class RemoteBookRepository implements BookRepository {
    async get(id: string, columns: (keyof Book)[] = []): Promise<BookInfosServeur> {
        let bookData = await api.get(`/books/books/${id}`)

        if (bookData == null) {
            throw new Error("yeay"); //A custom celon la pagge erreur.
        }

        const data = bookData.data.data;
        const book: BookInfosServeur = {
            id_book: data.id_book,
            title: data.title,
            description: data.description,
            publisher: data.publisher,
            publication_date: data.publication_date,
            page_number: data.page_number,
            language: data.language,
            cover_image_url: data.cover_image_url,
            authors: data.authors,
            genres: data.genres
        };

        return book;
    }

    async getAll(columns: (keyof Book)[] = []): Promise<Book[]> {
        throw new Error("Method not implemented.");
    }

    async getAllFromLibrary(): Promise<Book[]> {
        throw new Error("Method not implemented.");
    }

    async getAllMin(): Promise<BookMinInfos[]> {
        throw new Error("Method not implemented.");
    }

    async create(book: CreateBookDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async update(book: UpdateBookDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(book: DeleteBookDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
