import { RepositoryProxy, proxyRepository } from "@/helpers/proxyRepository";
import { Book } from "@/models";
import { APIAuthorRepository, AuthorRepository, SQLiteAuthorRepository } from "@/repositories/AuthorRepository";
import { APIBookRepository, BookRepository, SQLiteBookRepository } from "@/repositories/BookRepository";
import { APIGenreRepository, GenreRepository, SQLiteGenreRepository } from "@/repositories/GenreRepository";
import { APILibraryRepository, LibraryRepository, SQLiteLibraryRepository } from "@/repositories/LibraryRepository";
import { APIStateRepository, SQLiteStateRepository, StateRepository } from "@/repositories/StateRepository";
import { SQLiteDatabase } from "expo-sqlite";

export class BookController {
    db: SQLiteDatabase;
    book: RepositoryProxy<BookRepository, APIBookRepository, SQLiteBookRepository>;
    library: RepositoryProxy<LibraryRepository, APILibraryRepository, SQLiteLibraryRepository>;
    author: RepositoryProxy<AuthorRepository, APIAuthorRepository, SQLiteAuthorRepository>;
    genre: RepositoryProxy<GenreRepository, APIGenreRepository, SQLiteGenreRepository>;
    state: RepositoryProxy<StateRepository, APIStateRepository, SQLiteStateRepository>;

    constructor(db: SQLiteDatabase) {
        this.db = db;
        this.book = proxyRepository(new SQLiteBookRepository(db), new APIBookRepository());
        this.library = proxyRepository(new SQLiteLibraryRepository(db), new APILibraryRepository());
        this.author = proxyRepository(new SQLiteAuthorRepository(db), new APIAuthorRepository());
        this.genre = proxyRepository(new SQLiteGenreRepository(db), new APIGenreRepository());
        this.state = proxyRepository(new SQLiteStateRepository(db), new APIStateRepository());
    }

    async addToLibrary(id_library: string, book: Book): Promise<void> {

        try {
            await this.db.withExclusiveTransactionAsync(async () => {
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

                await this.db.runAsync(
                    `INSERT OR IGNORE INTO library_book (id_library, id_book) VALUES ($id_library, $id_book);`,
                    {
                        $id_library: id_library,
                        $id_book: book.id_book,
                    }
                )
            });

            console.log("addBookToLibrary: success")

        } catch (error) {
            console.log("Failed addBookToLibrary :", error)
        }
    }
}
