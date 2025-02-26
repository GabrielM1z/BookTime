import { RepositoryProxy, proxyRepository } from "@/helpers/proxyRepository";
import { APIAuthorRepository, AuthorRepository, SQLiteAuthorRepository } from "@/repositories/AuthorRepository";
import { APIBookRepository, BookRepository, SQLiteBookRepository } from "@/repositories/BookRepository";
import { APIGenreRepository, GenreRepository, SQLiteGenreRepository } from "@/repositories/GenreRepository";
import { APILibraryRepository, LibraryRepository, SQLiteLibraryRepository } from "@/repositories/LibraryRepository";
import { APIStateRepository, SQLiteStateRepository, StateRepository } from "@/repositories/StateRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { SynchronisationController } from "./SynchronisationController";

export class BookController extends SynchronisationController {
    book: RepositoryProxy<BookRepository, APIBookRepository, SQLiteBookRepository>;
    library: RepositoryProxy<LibraryRepository, APILibraryRepository, SQLiteLibraryRepository>;
    author: RepositoryProxy<AuthorRepository, APIAuthorRepository, SQLiteAuthorRepository>;
    genre: RepositoryProxy<GenreRepository, APIGenreRepository, SQLiteGenreRepository>;
    state: RepositoryProxy<StateRepository, APIStateRepository, SQLiteStateRepository>;

    constructor(db: SQLiteDatabase) {
        super("book", "book_action", db);
        this.book = proxyRepository(new SQLiteBookRepository(db), new APIBookRepository());
        this.library = proxyRepository(new SQLiteLibraryRepository(db), new APILibraryRepository());
        this.author = proxyRepository(new SQLiteAuthorRepository(db), new APIAuthorRepository());
        this.genre = proxyRepository(new SQLiteGenreRepository(db), new APIGenreRepository());
        this.state = proxyRepository(new SQLiteStateRepository(db), new APIStateRepository());
    }
}
