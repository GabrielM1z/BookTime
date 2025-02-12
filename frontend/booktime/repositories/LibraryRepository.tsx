import { Library, LibraryWithBooks, LibraryWithBooksMin } from '@/models/Library';
import { SQLiteDatabase } from 'expo-sqlite';
import { useSQLite } from "@/hooks/useSQLite";
import { Synchronisable } from './synchronisable';
import uuid from 'react-native-uuid';
import { bookRepositoryFactory } from './factories/bookRepositoryFactory';
import { BookAllInfos, BookMinInfos } from '@/models/Book';



export interface LibraryRepository {
    getAll: () => Promise<Library[]>;
    get: (id: string) => Promise<Library | null>;
    add: (name: string) => Promise<void>;
    getAllInfo: () => Promise<LibraryWithBooksMin[] | []>
    getAllBookFromLib: (id_library: string) => Promise<BookMinInfos[] | null> 
}

export class SQLiteLibraryRepository extends Synchronisable implements LibraryRepository {
    private db: SQLiteDatabase;
    private api: APILibraryRepository;

    constructor() {
        super();
        this.db = useSQLite().db;
        this.api = new APILibraryRepository();
    }

    async getAll(): Promise<Library[]> {
        let allRows = await this.db.getAllAsync<Library>(
            'SELECT * FROM library'
        );
        return allRows;
    }

    async get(id: string): Promise<Library | null> {
        const statement = await this.db.prepareAsync(
            'SELECT * FROM library WHERE id_library == $id'
        );

        const result = await statement.executeAsync({
            $id: id
        });

        return result ? (result as unknown as Library) : null;
    }

    async add(name: string): Promise<void> {
        const statement = await this.db.prepareAsync(
            'INSERT INTO library (id_library, name) VALUES ($id_library, $name);'
        );
        this.sync();

        await statement.executeAsync({
            $id_library: uuid.v4(),
            $name: name
        });
    }

    async getAllBookFromLib(id_library: string): Promise<BookMinInfos[]> {

        const statement = await this.db.prepareAsync(
            `SELECT book.*
            FROM book
            JOIN library_book ON book.id_book = library_book.id_book
            JOIN library ON library_book.id_library = library.id_library
            WHERE library.id_library = $id_library; `
        );

        const result = await statement.executeAsync({
            $id_library: id_library
        })

        const rows = await result.getAllAsync();

        console.log("Result getAllBookFromLib : ", rows)

        return rows ? (rows as unknown as BookMinInfos[]) : [];
    }

    async getAllInfo(): Promise<LibraryWithBooksMin[] | []> {

        try {
            const allLibrary: Library[] = await this.getAll();

            // Tableau de promesses pour récupérer tous les livres
            const libraryPromises = allLibrary.map(async (library) => {
                const listBookOfLibrary = await this.getAllBookFromLib(library.id_library);
                console.log("library", library.name, ":", listBookOfLibrary)
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


export class APILibraryRepository implements LibraryRepository {
    async getAll(): Promise<Library[]> {
        return [];
    }

    async get(id: string): Promise<Library | null> {
        return null;
    }

    async add(name: string): Promise<void> {
        return;
    }

    async getAllInfo(): Promise<LibraryWithBooksMin[] | []> {
        return [];
    }

    async getAllBookFromLib(id_library: string): Promise<BookMinInfos[] | null> {
        return null;
    }

}
