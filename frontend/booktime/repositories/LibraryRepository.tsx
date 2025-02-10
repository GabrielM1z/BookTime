import { Library, LibraryWithBooks, LibraryWithBooksMin } from '@/models/Library';
import { SQLiteDatabase } from 'expo-sqlite';
import { useSQLite } from "@/hooks/useSQLite";
import { Synchronisable } from './synchronisable';
import uuid from 'react-native-uuid';



export interface LibraryRepository {
    getAll: () => Promise<Library[]>;
    get: (id: string) => Promise<Library | null>;
    add: (name: string) => Promise<void>;
    getAllInfo: () => Promise<LibraryWithBooksMin[]|null>
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

    async getAllInfo():  Promise<LibraryWithBooksMin[]|null> {

        console.log("oui")
        let allRows = await this.db.getAllAsync<{
            id_library: string;
            name: string;
            id_book: string;
            title: string;
            cover_image_url: string;
        }>(
            'SELECT ' + 
            'library.id_library AS id_library, ' + 
            'library.name AS name, ' + 
            'book.id_book AS id_book, ' + 
            'book.title AS title, ' + 
            'book.cover_image_url AS cover_image_url ' + 
            'FROM library ' +
            'LEFT JOIN library_book ON library.id_library = library_book.id_library ' +
            'LEFT JOIN book ON book.id_book = library_book.id_book;'
        );

        console.log("rows : ",allRows)

        const libraryMap = new Map<string, LibraryWithBooksMin>();


        allRows.forEach(row => {
            const { id_library, name, id_book, title, cover_image_url } = row;

            // Si la bibliothèque n'existe pas encore dans le Map, on l'ajoute
            if (!libraryMap.has(id_library)) {
                libraryMap.set(id_library, {
                    id_library: id_library,
                    name: name,
                    books: [],
                });
            }

            // Ajouter le livre à la bibliothèque correspondante
            const library = libraryMap.get(id_library)!;
            library.books.push({
                id_book: id_book,
                title: title,
                cover_image_url: cover_image_url,
            });
        });

        console.log("oui")


        // Convertir le Map en tableau ou retourner une bibliothèque spécifique
        const librariesWithBooks = Array.from(libraryMap.values());

        return librariesWithBooks;
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

    async getAllInfo():  Promise<LibraryWithBooksMin[]|null> {
        return null;
    }
}
