import { SynchronisationController } from "@/controllers/SynchronisationController";
import { LibraryBook } from "@/models/LibraryBook";
import { SQLiteDatabase } from 'expo-sqlite';
import uuid from 'react-native-uuid';



export interface LibraryBookRepository {
    create: (newLibraryBook: LibraryBook) => Promise<void>;
    createAll: (listNewLibraryBook: LibraryBook[]) => Promise<void>;
    delete(newLibraryBook: LibraryBook): Promise<void> 
    deleteAll(listNewLibraryBook: LibraryBook[]): Promise<void> 
}

export class LocalLibraryBookRepository implements LibraryBookRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationController;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationController) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async create(newLibraryBook: LibraryBook): Promise<void> {
        await this.db.runAsync(
            `INSERT OR IGNORE INTO library_book (id_library, id_book) VALUES ($id_library, $id_book);`,
            {
                $id_library: newLibraryBook.id_library,
                $id_book: newLibraryBook.id_book,
            }
        )

    }

    async createAll(listNewLibraryBook: LibraryBook[]): Promise<void> {
        console.log("createAll begin")
        
        const insertLibraryBook = await this.db.prepareAsync(
            `INSERT OR IGNORE INTO library_book (id_library, id_book) VALUES ($id_library, $id_book);`,
        );

        try {
            console.log("createAll try")

            for (const newLibraryBook of listNewLibraryBook) {

                await insertLibraryBook.executeAsync({
                    $id_library: newLibraryBook.id_library,
                    $id_book: newLibraryBook.id_book,
                });
            }
        } 
        catch (error) {
            console.error("createAll failed:", error);
        }
        finally {
            await insertLibraryBook.finalizeAsync();
        }
    }

    async delete(newLibraryBook: LibraryBook): Promise<void> {
        await this.db.runAsync(
            `DELETE FROM library_book WHERE id_library == $id_library AND id_book == $id_book;`,
            {
                $id_library: newLibraryBook.id_library,
                $id_book: newLibraryBook.id_book,
            }
        )
    }

    async deleteAll(listNewLibraryBook: LibraryBook[]): Promise<void> {
        const deleteLibraryBook = await this.db.prepareAsync(
            `DELETE FROM library_book WHERE id_library == $id_library AND id_book == $id_book;`,
        );
        try {

            for (const newLibraryBook of listNewLibraryBook) {

                await deleteLibraryBook.executeAsync({
                    $id_library: newLibraryBook.id_library,
                    $id_book: newLibraryBook.id_book,
                });
            }
        } finally {
            await deleteLibraryBook.finalizeAsync();
        }

    }

}


export class RemoteLibraryBookRepository implements LibraryBookRepository {
    
    constructor() {
    }
    
    async create(newLibraryBook: LibraryBook): Promise<void> {
    }

    async createAll(listNewLibraryBook: LibraryBook[]): Promise<void> {

    }

    async delete(newLibraryBook: LibraryBook): Promise<void> {
    }

    async deleteAll(listNewLibraryBook: LibraryBook[]): Promise<void> {
    }

}