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
import { LibraryDTO, LibraryWithBooksMin } from "@/models/Library";

export interface BookControllerProps {
    book: BookRepository;
    library: LibraryRepository;
    author: AuthorRepository;
    genre: GenreRepository;
    state: StateRepository;
    libraryBook: LibraryBookRepository;
    authorBook: AuthorBookRepository;
    sharedLibrary: SharedLibraryRepository;
    addBook: (newBookIsbn: string) => Promise<void>
    createLibrary: (library: LibraryDTO) => Promise<void>
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
    state: LocalStateRepository;
    libraryBook: LocalLibraryBookRepository;
    authorBook: LocalAuthorBookRepository;
    sharedLibrary: LocalSharedLibraryRepository;

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
        this.libraryBook = new LocalLibraryBookRepository(db, id_user, this.sync);
        this.authorBook = new LocalAuthorBookRepository(db, id_user, this.sync);
        this.sharedLibrary = new LocalSharedLibraryRepository(db, id_user, this.sync);
    }

    // async addBookToLibrary(): Promise<void> {
    //     try {
    //         await this.db.withExclusiveTransactionAsync(async () => {

    //             const libraryBook: LibraryBook = {
    //                 id_book: newBook.id_book,
    //                 id_library: id_library,
    //             }

    //             this.libraryBook.create(libraryBook);
    //         });
    // }

    async addBook(newBookIsbn: string): Promise<void> {

        let newBook: BookInfosServeur = await this.remote.get(newBookIsbn);
        const listLibrary = await this.library.getAll()
        const id_library = listLibrary[0].id_library;

        try {
            await this.db.withExclusiveTransactionAsync(async () => {

                const libraryBook: LibraryBook = {
                    id_book: newBook.id_book,
                    id_library: id_library,
                }

                const state: State = {
                    id_book: this.id_user,
                    id_user: newBook.id_book,
                    state: "",
                    progression: 0,
                    read_count: 0,
                    last_read_date: 0,
                    is_available: false
                }

                const listAuthorBook: AuthorBook[] = []
                for (const authors of newBook.authors) {
                    listAuthorBook.push({
                        id_author: authors.id_author,
                        id_book: newBook.id_book,
                    })
                }

                await this.book.create(newBook);
                await this.state.create(state);
                await this.libraryBook.create(libraryBook);
                await this.author.createAll(newBook.authors);
                await this.authorBook.createAll(listAuthorBook);
            });

            console.log("addBook: success")

        } catch (error) {
            console.log("Failed addBook :", error)
        }
    }

    async createLibrary(library: LibraryDTO): Promise<void> {
        try {
            await this.db.withExclusiveTransactionAsync(async () => {

                await this.library.create(library);

                const newIdLibrary = await this.library.getLastInsertedId();

                if (newIdLibrary == null) {
                    throw Error("newIdLibrary is null")
                }

                const sharedLibrary: SharedLibrary = {
                    id_user: this.id_user,
                    id_library: newIdLibrary,
                }

                this.sharedLibrary.create(sharedLibrary);

            })
        } catch (error) {
            console.log("Failed createLibrary :", error)

        }
    }

    async getAllInfoLibrary(): Promise<LibraryWithBooksMin[] | []> {
        try {
            const allLibrary: Library[] = await this.library.getAll();

            // Tableau de promesses pour récupérer tous les livres
            const libraryPromises = allLibrary.map(async (library) => {
                const listBookOfLibrary = await this.library.getAllBookFromLib(library.id_library);
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
    
    async addBook(newBookIsbn: string): Promise<void> {

    }

    async createLibrary(library: LibraryDTO): Promise<void> {

    }
}
