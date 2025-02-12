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
    getAllInfo: () => Promise<LibraryWithBooksMin[] | null>
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
            'SELECT * ' +
            'FROM book ' +
            'JOIN library_book ON book.id_book = library_book.id_book ' +
            'JOIN library ON library_book.id_library = library.id_library ' +
            'WHERE library_book.id_library == $id_library '
        );

        const result = await statement.executeAsync({
            $id_library: id_library
        })

        return result ? (result as unknown as BookAllInfos[]) : [];
    }

    async getAllInfo(): Promise<LibraryWithBooksMin[] | []> {

        const allLibrary: Library[] = await this.getAll();
        const allLibraryWithBook: LibraryWithBooksMin[] = []; 
        try {

            for (let library of allLibrary){
                let listBookOfLibrary = await this.getAllBookFromLib(library.id_library);
                console.log("etagere", library.name, ":", listBookOfLibrary)
                let newLibraryWithBooks : LibraryWithBooksMin = {
                    id_library: library.id_library,
                    name: library.name,
                    books: listBookOfLibrary
                };
    
                allLibraryWithBook.push(newLibraryWithBooks);
            }
            
        } catch (error) {
            console.log("Error", error);            
        }


        return allLibraryWithBook;
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

    async getAllInfo(): Promise<LibraryWithBooksMin[] | null> {
        return null;
    }

    async getAllBookFromLib(id_library: string): Promise<BookMinInfos[] | null> {
        return null;
    }

}
