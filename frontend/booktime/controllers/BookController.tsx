import { RepositoryProxy, proxyRepository } from "@/helpers/proxyRepository";
import { RemoteAuthorRepository, AuthorRepository, LocalAuthorRepository } from "@/repositories/AuthorRepository";
import { RemoteBookRepository, BookRepository, LocalBookRepository } from "@/repositories/BookRepository";
import { RemoteGenreRepository, GenreRepository, LocalGenreRepository } from "@/repositories/GenreRepository";
import { RemoteLibraryRepository, LibraryRepository, LocalLibraryRepository } from "@/repositories/LibraryRepository";
import { RemoteStateRepository, LocalStateRepository, StateRepository } from "@/repositories/StateRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { SynchronisationController } from "./SynchronisationController";
import { SynchronisationProxy } from "./SynchronisationProxy";
import { Book, State, Author, Library, Action } from "@/models";
import { BookInfosServeur } from "@/models/Book";
import { LibraryBook } from "@/models/LibraryBook";
import { LibraryBookRepository, LocalLibraryBookRepository, RemoteLibraryBookRepository } from "@/repositories/LibraryBookRepository";
import { AuthorBookRepository, LocalAuthorBookRepository, RemoteAuthorBookRepository } from "@/repositories/AuthorBookRepository";
import { AuthorBook } from "@/models/AuthorBook";
import { SharedLibrary } from "@/models/SharedLibrary";
import { LocalSharedLibraryRepository, RemoteSharedLibraryRepository, SharedLibraryRepository } from "@/repositories/SharedLibrariesRepository";
import { CreateLibraryDto, LibraryWithBooksMin } from "@/models/Library";
import { guestUserId } from "@/constants";
import { BookResponseSync } from "@/types/synchronisation";
import { VariableRepository } from "@/repositories/VariableRepository";
import { syncAfterMethod } from "@/decorators/synchronisation";
import { Buffer } from "buffer";
import { safeActionDecode } from "@/helpers/parser";

export interface BookControllerProps {
    book: BookRepository;
    library: LibraryRepository;
    author: AuthorRepository;
    genre: GenreRepository;
    state: StateRepository;
    libraryBook: LibraryBookRepository;
    authorBook: AuthorBookRepository;
    sharedLibrary: SharedLibraryRepository;
    enter: () => Promise<void>
    exit: () => void
    addBook: (idBook: string) => Promise<void>
    createLibrary: (library: CreateLibraryDto) => Promise<void>
    getAllLibraryInfo: () => Promise<LibraryWithBooksMin[] | []>
    getBookById: (idBook: string, mode: string) => Promise<Book | BookInfosServeur>
}

export class LocalBookController extends SynchronisationController<BookResponseSync> implements BookControllerProps {
    protected db: SQLiteDatabase;
    protected id_user: string;
    protected remoteBook: RemoteBookRepository;
    protected remoteAuthor: RemoteAuthorRepository;


    book: LocalBookRepository;
    library: LocalLibraryRepository;
    author: LocalAuthorRepository;
    genre: LocalGenreRepository;
    state: LocalStateRepository;
    libraryBook: LocalLibraryBookRepository;
    authorBook: LocalAuthorBookRepository;
    sharedLibrary: LocalSharedLibraryRepository;
    variable: VariableRepository;

    protected tableToRepositoryMap: { [key: string]: keyof BookControllerProps } = {
        "book": "book",
        "library": "library",
        "author": "author",
        "genre": "genre",
        "state": "state",
        "library_book": "libraryBook",
        "author_book": "authorBook",
        "shared_library": "sharedLibrary"
    };

    constructor(db: SQLiteDatabase, id_user: string) {
        super("books", "book_action", db, id_user);

        this.db = db;
        this.id_user = id_user;
        this.remoteBook = new RemoteBookRepository();
        this.remoteAuthor = new RemoteAuthorRepository();


        this.book = new LocalBookRepository(db, id_user);
        this.library = new LocalLibraryRepository(db, id_user, this.sync);
        this.author = new LocalAuthorRepository(db, id_user);
        this.genre = new LocalGenreRepository(db, id_user);
        this.state = new LocalStateRepository(db, id_user, this.sync);
        this.libraryBook = new LocalLibraryBookRepository(db, id_user, this.sync);
        this.authorBook = new LocalAuthorBookRepository(db, id_user);
        this.sharedLibrary = new LocalSharedLibraryRepository(db, id_user, this.sync);
        this.variable = new VariableRepository(db);
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


    async processActions({ required_books, actions_to_exec }: BookResponseSync) {
        console.log("Livres à récupérer :", required_books);
        console.log("Actions à exécuter :", actions_to_exec);

        try {
            for (const book of required_books ?? []) {
                await this.addBook(book);
            }

            for (const action of actions_to_exec) {
                const { table_name, type, action: data } = action;
                const decodedData = safeActionDecode(data);
                const repository = this.tableToRepositoryMap[table_name.toLowerCase()];
                const func = this.actionToCudMap[type];

                if (func && repository) {
                    await this.variable.set(`syncing_${type.toLowerCase()}_${table_name.toLowerCase()}`, "true"); 
                    await (this[repository] as any)[func](decodedData, { syncing: true });
                    await this.variable.set(`syncing_${type.toLowerCase()}_${table_name.toLowerCase()}`, "false"); 
                }
            }
        } catch (error) {
            console.log("Error processActions", error);
        }
    }

    async enter() {
        if (this.id_user !== guestUserId) {
            await this.sync.runSync(); // Sync all data
        }

        await this.variable.set("current_user", this.id_user);
    }

    async exit() {
        
    }

    async clearUser(idUser: string) {
        await this.db.runAsync(`DELETE FROM library WHERE id_user = $id_user`, { $id_user: idUser });
        await this.db.runAsync(`DELETE FROM state WHERE id_user = $id_user`, { $id_user: idUser });
    }

    // @ts-ignore
    @syncAfterMethod()
    async addBook(idBook: string): Promise<void> {
        const bookServer = await this.remoteBook.get(idBook);

        try {
            await this.db.withExclusiveTransactionAsync(async () => {
                const book: Book = {
                    id_book: bookServer.id_book,
                    title: bookServer.title,
                    cover_image_url: bookServer.cover_image_url,
                    description: bookServer.description,
                    publication_date: bookServer.publication_date,
                    language: bookServer.language,
                    publisher: bookServer.publisher,
                    page_number: bookServer.page_number,
                }

                const state: State = {
                    id_book: book.id_book,
                    id_user: this.id_user,
                    state: "",
                    progression: 0,
                    readcount: 0,
                    last_read_date: '1970-01-01T00:00:00.000Z',
                    is_available: false,
                    comment: "",
                    rate: 0,
                }

                const authorBooks = (bookServer.authors ?? []).map((author : Author) => ({
                    id_author: author.id_author,
                    id_book: book.id_book,
                }));

                await this.book.create(book);
                await this.state.create(state);
                await this.author.createAll(bookServer.authors);
                await this.authorBook.createAll(authorBooks);
            });

            console.log("addBook: success")

        } catch (error) {
            console.log("Failed addBook :", error)
        }
    }

    // @ts-ignore
    @syncAfterMethod()
    async createLibrary(library: CreateLibraryDto): Promise<void> {
        try {
            await this.db.withExclusiveTransactionAsync(async () => {
                await this.library.create(library);
                const idLibrary = (await this.library.getLastInserted())!.id_library;

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

    async enter() { }
    async exit() { }

    async addBook(idBook: string): Promise<void> { }

    async createLibrary(library: CreateLibraryDto): Promise<void> { }

    async getAllLibraryInfo(): Promise<LibraryWithBooksMin[] | []> {
        return [];
    }
}
