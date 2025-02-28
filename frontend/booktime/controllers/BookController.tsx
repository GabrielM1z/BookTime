import { RepositoryProxy, proxyRepository } from "@/helpers/proxyRepository";
import { RemoteAuthorRepository, AuthorRepository, LocalAuthorRepository } from "@/repositories/AuthorRepository";
import { RemoteBookRepository, BookRepository, LocalBookRepository } from "@/repositories/BookRepository";
import { RemoteGenreRepository, GenreRepository, LocalGenreRepository } from "@/repositories/GenreRepository";
import { RemoteLibraryRepository, LibraryRepository, LocalLibraryRepository } from "@/repositories/LibraryRepository";
import { RemoteStateRepository, LocalStateRepository, StateRepository } from "@/repositories/StateRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { SynchronisationController } from "./SynchronisationController";
import { Book } from "@/models";

export interface BookControllerProps {
    book: BookRepository;
    library: LibraryRepository;
    author: AuthorRepository;
    genre: GenreRepository;
    state: StateRepository;

    addToLibrary: (id_library: string, book: Book) => Promise<void>;
}

export class LocalBookController implements BookControllerProps {
    protected db: SQLiteDatabase;
    protected id_user: string;
    protected remote: RemoteBookRepository;

    sync: SynchronisationController;
    book: LocalBookRepository;
    library: LocalLibraryRepository;
    author: LocalAuthorRepository;
    genre: LocalGenreRepository;
    state:  LocalStateRepository;

    constructor(db: SQLiteDatabase, id_user: string) {
        this.sync = new SynchronisationController("book", "book_action", db);

        this.db = db;
        this.id_user = id_user;
        this.remote = new RemoteBookRepository();

        this.book = new LocalBookRepository(db, id_user, this.sync);
        this.library = new LocalLibraryRepository(db, id_user, this.sync);
        this.author = new LocalAuthorRepository(db, id_user, this.sync);
        this.genre = new LocalGenreRepository(db, id_user, this.sync);
        this.state = new LocalStateRepository(db, id_user, this.sync);
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

export class RemoteBookController implements BookControllerProps {
    book: RemoteBookRepository;
    library: RemoteLibraryRepository;
    author: RemoteAuthorRepository;
    genre: RemoteGenreRepository;
    state: RemoteStateRepository;
    
    constructor(id_user: string) {
        this.book = new RemoteBookRepository();
        this.library = new RemoteLibraryRepository();
        this.author = new RemoteAuthorRepository();
        this.genre = new RemoteGenreRepository();
        this.state = new RemoteStateRepository();
    }

    addToLibrary(id_library: string, book: Book): Promise<void>{
        return new Promise<void>(resolve => resolve());
    }
}
