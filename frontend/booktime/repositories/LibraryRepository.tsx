import { Library } from '@/models/Library';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Synchronisable } from './synchronisable';


export interface LibraryRepository {
    getAll: () => Promise<Library[]>;
    get: (id: string) => Promise<Library | null>;
    add: (name: string) => Promise<void>;
}

export class SQLiteLibraryRepository extends Synchronisable implements LibraryRepository {
    private db: SQLiteDatabase;
    private api: APILibraryRepository;

    constructor() {
        super();
        this.db = useSQLiteContext();
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
            'INSERT INTO library (name) VALUES ($name);'
        );

        this.sync();
        console.log("oui")


        await statement.executeAsync({
            $name: name
        });
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
}
