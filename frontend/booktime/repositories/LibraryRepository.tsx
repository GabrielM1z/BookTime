import { Library, LibraryWithBooks, LibraryWithBooksMin } from '@/models/Library';
import { SQLiteDatabase } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { Book, BookMinInfos } from '@/models/Book';
import { SynchronisationController } from '@/controllers/SynchronisationController';



export interface LibraryRepository {
    getAll: () => Promise<Library[]>;
    get: (id: string) => Promise<Library | null>;
    add: (name: string) => Promise<void>;
    delete: (id: string) => Promise<void>;
    getAllInfo: () => Promise<LibraryWithBooksMin[] | []>
    getAllBookFromLib: (id_library: string) => Promise<BookMinInfos[] | null>
    getAllLibraryFromBook: (id_book: string) => Promise<Library[]>;
    getAllNotLibraryFromBook: (id_book: string) => Promise<Library[]>;
}

export class LocalLibraryRepository implements LibraryRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationController;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationController) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async getAll(): Promise<Library[]> {
        let allRows = await this.db.getAllAsync<Library>(
            'SELECT * FROM library'
        );
        return allRows;
    }

    async get(id: string): Promise<Library | null> {
        const result = await this.db.getFirstAsync<Library>(
            'SELECT * FROM library WHERE id_library == $id',
            { $id: id }
        );

        return result!;
    }

    async add(name: string): Promise<void> {
        await this.db.runAsync(
            'INSERT INTO library (id_library, name) VALUES ($id_library, $name);',
            { $id_library: uuid.v4(), $name: name }
        )
    }

    async delete(id: string): Promise<void> {
        await this.db.withTransactionAsync(async () => {
            try {
                // Suppression des associations entre la bibliothèque et les livres
                const deleteLibraryBooks = await this.db.prepareAsync(
                    'DELETE FROM library_book WHERE id_library = $id'
                );
                await deleteLibraryBooks.executeAsync({ $id: id });
                await deleteLibraryBooks.finalizeAsync(); // Fermer la déclaration

                // Suppression des associations entre la bibliothèque et les utilisateurs partagés
                const deleteSharedLibrary = await this.db.prepareAsync(
                    'DELETE FROM shared_library WHERE id_library = $id'
                );
                await deleteSharedLibrary.executeAsync({ $id: id });
                await deleteSharedLibrary.finalizeAsync(); // Fermer la déclaration

                // Suppression de la bibliothèque elle-même
                const deleteLibrary = await this.db.prepareAsync(
                    'DELETE FROM library WHERE id_library = $id'
                );
                await deleteLibrary.executeAsync({ $id: id });
                await deleteLibrary.finalizeAsync(); // Fermer la déclaration

                console.log("deleted");
            } catch (error) {
                console.error('Error deleting library:', error);
                throw error; // Re-throw the error to handle it at a higher level if needed
            }
        });
    }


    async delete2(id: string): Promise<void> {

        await this.db.withTransactionAsync(async () => {
            const deleteLibraryBooks = await this.db.prepareAsync(
                'DELETE FROM library_book WHERE id_library = $id'
            );
            await deleteLibraryBooks.executeAsync({ $id: id });

            const deleteSharedLibrary = await this.db.prepareAsync(
                'DELETE FROM shared_library WHERE id_library = $id'
            );
            await deleteSharedLibrary.executeAsync({ $id: id });

            const deleteLibrary = await this.db.prepareAsync(
                'DELETE FROM library WHERE id_library = $id'
            );
            await deleteLibrary.executeAsync({ $id: id });
        });
    }


    async getAllBookFromLib(id_library: string): Promise<BookMinInfos[]> {
        const books = this.db.getAllAsync<BookMinInfos>(
            `SELECT book.id_book, book.title, book.cover_image_url
            FROM book
            JOIN library_book ON book.id_book = library_book.id_book
            JOIN library ON library_book.id_library = library.id_library
            WHERE library.id_library = $id_library; `,
            { $id_library: id_library }
        );

        return books;
    }

    async getAllInfo(): Promise<LibraryWithBooksMin[] | []> {

        try {
            const allLibrary: Library[] = await this.getAll();

            // Tableau de promesses pour récupérer tous les livres
            const libraryPromises = allLibrary.map(async (library) => {
                const listBookOfLibrary = await this.getAllBookFromLib(library.id_library);
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

    async getAllLibraryFromBook(id_book: string): Promise<Library[]> {
        const libraries = this.db.getAllAsync<Library>(
            `SELECT library.*
            FROM library
            JOIN library_book ON library.id_library = library_book.id_library
            JOIN book ON library_book.id_book = book.id_book
            WHERE book.id_book = $id_book; `,
            { $id_book: id_book }
        );

        return libraries;
    }

    async getAllNotLibraryFromBook(id_book: string): Promise<Library[]> {
        const libraries = this.db.getAllAsync<Library>(
            `SELECT library.*
            FROM library
            WHERE library.id_library NOT IN (
                SELECT library.id_library
                FROM library
                JOIN library_book ON library.id_library = library_book.id_library
                JOIN book ON library_book.id_book = book.id_book
                WHERE book.id_book = $id_book
            ); `,
            { $id_book: id_book }
        );

        return libraries;
    }

}


export class RemoteLibraryRepository implements LibraryRepository {
    async getAll(): Promise<Library[]> {
        return [];
    }

    async get(id: string): Promise<Library | null> {
        return null;
    }

    async add(name: string): Promise<void> {
        return;
    }

    async delete(id: string): Promise<void> {
        return;
    }

    async getAllInfo(): Promise<LibraryWithBooksMin[] | []> {
        return [];
    }

    async getAllBookFromLib(id_library: string): Promise<BookMinInfos[] | null> {
        return null;
    }

    async getAllLibraryFromBook(id_book: string): Promise<Library[]> {
        return [];
    }

    async getAllNotLibraryFromBook(id_book: string): Promise<Library[]> {
        return [];
    }
}
