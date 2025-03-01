import { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';
import { useSQLite } from "@/hooks/useSQLite";
import { Book, BookInfosServeur, BookMinInfos } from '@/models/Book';
import { syncAfterMethod, syncBeforeMethod } from '@/decorators/synchronisation';
import { formatColumns } from '@/helpers';
import { api } from "@/services/axios"
import { linkToBase64 } from '@/helpers/image';
import { SynchronisationController } from '@/controllers/SynchronisationController';

export interface BookRepository {
    get: (id: string, columns?: (keyof Book)[]) => Promise<Book>;
    getAll: (columns?: (keyof Book)[]) => Promise<Book[]>;
    getAllFromLib: (id_lib: string) => Promise<Book[]>
    add: (state: Book) => Promise<void>;
    // addToLibrary: (id_library: string, book: Book) => Promise<void>
    delete: (id: string) => Promise<void>;
    // deleteFromLibrary: (id_library: string, id_book: string) => Promise<void>
    // updateBookLibrary: (id_library: string, id_book: string) => Promise<void>
}

export class LocalBookRepository implements BookRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationController;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationController) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async getLastInsertedId(): Promise<string> {
        const result = await this.db.getFirstAsync<Book>(
            `SELECT * FROM book ORDER BY rowid DESC LIMIT 1;`,
        );

        return (result as Book).id_book;
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
        console.log("id user :", this.id_user);
        
        try {
            const args = formatColumns(columns, ['book.id_book']);
            let allRows = await this.db.getAllAsync<Book>(
                `SELECT ${args} FROM book
                LEFT JOIN state ON state.id_book = book.id_book
                WHERE state.id_user = $id_user`, 
                { $id_user: this.id_user }
            );
            console.log("allrows: ",allRows);
            
            return allRows;

        } catch (error) {
            console.log("getAll", error)
            return []
        }
    }

    async create(book: BookInfosServeur): Promise<void> {
        try {
            await this.db.runAsync(
                `INSERT OR IGNORE INTO book (id_book, title, description, publisher, publication_date, page_number, language, cover_image_url) 
                VALUES ($id_book, $title, $description, $publisher, $publication_date, $page_number, $language, $cover_image_url);`,
                {
                    $id_book: book.id_book,
                    $title: book.title,
                    $description: book.description,
                    $publisher: book.publisher,
                    $publication_date: book.publication_date,
                    $page_number: book.page_number,
                    $language: book.language,
                    $cover_image_url: book.cover_image_url,
                }
            )
        } catch (error) {
            console.log("create :", error);
        }
    }

    async getAllMin(): Promise<BookMinInfos[]> {
        let allRows = await this.db.getAllAsync<BookMinInfos>(
            'SELECT id_book, title, cover_image_url FROM book'
        );
        return allRows;
    }

    async getAllFromLib(id_library: string): Promise<Book[]> {
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

    // @ts-ignore
    @syncAfterMethod()
    async add(book: Book): Promise<void> {
        await this.db.runAsync(
            `INSERT INTO book (id_book, title, description, publisher, publication_date, page_number, language, cover_image_url)
            VALUES ($id_book, $title, $description, $publisher, $publication_date, $page_number, $language, $cover_image_url);`,
            {
                $id_book: book.id_book,
                $title: book.title,
                $description: book.description,
                $publisher: book.publisher,
                $publication_date: book.publication_date,
                $page_number: book.page_number,
                $language: book.language,
                $cover_image_url: book.cover_image_url,
            }
        );
    }

    // /**
    //  * Ajoute un livre à une librairie sans le creer
    //  * 
    //  * @param id_library 
    //  * @param id_book 
    //  */
    // async updateBookLibrary(id_library: string, id_book: string): Promise<void> {
    //     try {
    //         const insertLibraryBookStmt = await this.db.prepareAsync(
    //             ' INSERT OR IGNORE INTO library_book (id_library, id_book) VALUES ($id_library, $id_book);'
    //         );

    //         let resultInsertLibraryBook = await insertLibraryBookStmt.executeAsync({
    //             $id_library: id_library,
    //             $id_book: id_book,
    //         });

    //         console.log("updateBookLibrary: success")

    //     } catch (error) {
    //         console.log("Failed addBookToLibrary :", error)

    //     }
    // }

    async delete(id: string): Promise<void> {
        await this.db.runAsync(
            `DELETE FROM library_book WHERE id_book == $id;`,
            {
                $id: id,
            }
        );
    }

    // async deleteFromLibrary(id_library: string, id_book: string): Promise<void> {
    //     await this.db.runAsync(
    //         `DELETE FROM library_book WHERE id_library == $id_library AND id_book == $id_book;`,
    //         {
    //             $id_library: id_library,
    //             $id_book: id_book,
    //         }
    //     )
    // }
}

export class RemoteBookRepository implements BookRepository {

    async get(id: string, columns: (keyof Book)[] = []): Promise<BookInfosServeur> {
        let bookData = await api.get(`/books/books/${id}`)

        if (bookData == null) {
            throw new Error("yeay"); //A custom celon la pagge erreur.
        }
        // let imageBase64 = await linkToBase64(bookData.data.data.cover_image_url)
        const book: BookInfosServeur = {
            id_book: bookData.data.data.id_book,
            title: bookData.data.data.title,
            description: bookData.data.data.description,
            publisher: bookData.data.data.publisher,
            publication_date: bookData.data.data.publication_date,
            page_number: bookData.data.data.page_number,
            language: bookData.data.data.language,
            cover_image_url: bookData.data.data.cover_image_url,
            authors: bookData.data.data.authors,
            genres: bookData.data.data.genres
        };

        return book;
    }

    async getAll(columns: (keyof Book)[] = []): Promise<Book[]> {
        return [];
    }

    async getAllFromLib(): Promise<Book[]> {
        return [];
    }

    async getAllMin(): Promise<BookMinInfos[]> {
        return [];
    }

    async add(book: Book): Promise<void> {
        return;
    }

    // async addToLibrary(id_library: string, book: Book): Promise<void> {
    //     return;
    // }

    async updateBookLibrary(id_library: string, id_book: string): Promise<void> {
        return;
    }

    async delete(id: string): Promise<void> {
        return;
    }

    async deleteFromLibrary(id_library: string, id_book: string): Promise<void> {
        return;
    }
}
