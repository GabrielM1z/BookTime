import { RepositoryProxy, proxyRepository } from "@/helpers/proxyRepository";
import { RemoteAuthorRepository, AuthorRepository, LocalAuthorRepository } from "@/repositories/AuthorRepository";
import { RemoteBookRepository, BookRepository, LocalBookRepository } from "@/repositories/BookRepository";
import { RemoteGenreRepository, GenreRepository, LocalGenreRepository } from "@/repositories/GenreRepository";
import { RemoteLibraryRepository, LibraryRepository, LocalLibraryRepository } from "@/repositories/LibraryRepository";
import { RemoteStateRepository, LocalStateRepository, StateRepository } from "@/repositories/StateRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { SynchronisationController } from "./SynchronisationController";
import { Book, State, Author, Library } from "@/models";
import { BookInfosServeur } from "@/models/Book";
import { LibraryBook } from "@/models/LibraryBook";
import { LibraryBookRepository, LocalLibraryBookRepository, RemoteLibraryBookRepository } from "@/repositories/LibraryBookRepository";
import { AuthorBookRepository, LocalAuthorBookRepository, RemoteAuthorBookRepository } from "@/repositories/AuthorBookRepository";
import { AuthorBook } from "@/models/AuthorBook";
import { SharedLibrary } from "@/models/SharedLibrary";
import { LocalSharedLibraryRepository, RemoteSharedLibraryRepository, SharedLibraryRepository } from "@/repositories/SharedLibrariesRepository";
import { CreateLibraryDto, LibraryWithBooksMin } from "@/models/Library";

export interface BookControllerProps {
    book: BookRepository;
    library: LibraryRepository;
    author: AuthorRepository;
    genre: GenreRepository;
    state: StateRepository;
    libraryBook: LibraryBookRepository;
    authorBook: AuthorBookRepository;
    sharedLibrary: SharedLibraryRepository;
    addBook: (idBook: string, idLibrary: string) => Promise<void>
    createLibrary: (library: CreateLibraryDto) => Promise<void>
    getAllLibraryInfo: () => Promise<LibraryWithBooksMin[] | []>
    getBookById: (idBook: string, mode: string) => Promise<Book | BookInfosServeur>
}

export class LocalBookController implements BookControllerProps {
    protected db: SQLiteDatabase;
    protected id_user: string;
    protected remoteBook: RemoteBookRepository;
    protected remoteAuthor: RemoteAuthorRepository;


    sync: SynchronisationController;
    book: LocalBookRepository;
    library: LocalLibraryRepository;
    author: LocalAuthorRepository;
    genre: LocalGenreRepository;
    state: LocalStateRepository;
    libraryBook: LocalLibraryBookRepository;
    authorBook: LocalAuthorBookRepository;
    sharedLibrary: LocalSharedLibraryRepository;

    constructor(db: SQLiteDatabase, id_user: string) {
        this.sync = new SynchronisationController("book", "book_action", db);

        this.db = db;
        this.id_user = id_user;
        this.remoteBook = new RemoteBookRepository();
        this.remoteAuthor = new RemoteAuthorRepository();


        this.book = new LocalBookRepository(db, id_user, this.sync);
        this.library = new LocalLibraryRepository(db, id_user, this.sync);
        this.author = new LocalAuthorRepository(db, id_user, this.sync);
        this.genre = new LocalGenreRepository(db, id_user, this.sync);
        this.state = new LocalStateRepository(db, id_user, this.sync);
        this.libraryBook = new LocalLibraryBookRepository(db, id_user, this.sync);
        this.authorBook = new LocalAuthorBookRepository(db, id_user, this.sync);
        this.sharedLibrary = new LocalSharedLibraryRepository(db, id_user, this.sync);
    }

    //Retourne la méthode local ou remote selon la valeur du mode
    async getBookById(idBook: string, mode: string): Promise<Book | BookInfosServeur> {

        switch (mode) {
            case "library":
                return await this.book.get(idBook);
                break;
            case "search":
                let res = await this.remoteBook.get(idBook);
                return res
                break;

            default:
                return await this.remoteBook.get(idBook)
                break;
        }
    }


    async addBook(idBook: string, idLibrary: string): Promise<void> {

        const book = await this.remoteBook.get(idBook);

        try {
            await this.db.withExclusiveTransactionAsync(async () => {
                const libraryBook: LibraryBook = {
                    id_book: book.id_book,
                    id_library: idLibrary,
                }

                const state: State = {
                    id_book: book.id_book,
                    id_user: this.id_user,
                    state: "",
                    progression: 0,
                    read_count: 0,
                    last_read_date: "",
                    is_available: false
                }

                const authorBooks = (book.authors ?? []).map((author) => ({
                    id_author: author.id_author,
                    id_book: book.id_book,
                }))

                await this.book.create(book);
                await this.state.create(state);
                await this.libraryBook.create(libraryBook);
                await this.author.createAll(book.authors);
                await this.authorBook.createAll(authorBooks);
            });

            console.log("addBook: success")

        } catch (error) {
            console.log("Failed addBook :", error)
        }
    }

    async createLibrary(library: CreateLibraryDto): Promise<void> {
        try {
            await this.db.withExclusiveTransactionAsync(async () => {

                const idLibrary = await this.library.create(library);

                const sharedLibrary: SharedLibrary = {
                    id_user: this.id_user,
                    id_library: idLibrary,
                }

                this.sharedLibrary.create(sharedLibrary);

                console.log("Library created :", idLibrary);
            })
        } catch (error) {
            console.log("Failed createLibrary :", error)

        }
    }

    async getAllLibraryInfo(): Promise<LibraryWithBooksMin[] | []> {
        try {
            const allLibrary: Library[] = await this.library.getAll();

            // Tableau de promesses pour récupérer tous les livres
            const libraryPromises = allLibrary.map(async (library) => {
                const listBookOfLibrary = await this.book.getAllFromLibrary(library.id_library);
                return {
                    id_library: library.id_library,
                    name: library.name,
                    books: listBookOfLibrary
                };
            });

            // Attendre que toutes les promesses soient résolues
            const allLibraryWithBook: LibraryWithBooksMin[] = await Promise.all(libraryPromises);

            return allLibraryWithBook;

        } catch (error) {
            console.log("Error", error);
            return [];
        }
    }
}

export class RemoteBookController implements BookControllerProps {
    book: RemoteBookRepository;
    library: RemoteLibraryRepository;
    author: RemoteAuthorRepository;
    genre: RemoteGenreRepository;
    state: RemoteStateRepository;
    libraryBook: RemoteLibraryBookRepository;
    authorBook: RemoteAuthorBookRepository;
    sharedLibrary: RemoteSharedLibraryRepository;


    constructor(id_user: string) {
        this.book = new RemoteBookRepository();
        this.library = new RemoteLibraryRepository();
        this.author = new RemoteAuthorRepository();
        this.genre = new RemoteGenreRepository();
        this.state = new RemoteStateRepository();
        this.libraryBook = new RemoteLibraryBookRepository();
        this.authorBook = new RemoteAuthorBookRepository();
        this.sharedLibrary = new RemoteSharedLibraryRepository();
    }

    async getBookById(idBook: string, mode: string): Promise<Book> {
        return await this.book.get(idBook)
    }

    async addBook(idBook: string, idLibrary: string): Promise<void> { }

    async createLibrary(library: CreateLibraryDto): Promise<void> { }

    async getAllLibraryInfo(): Promise<LibraryWithBooksMin[] | []> {
        return [];
    }
}
