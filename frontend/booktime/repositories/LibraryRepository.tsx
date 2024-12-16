import api from '@/services/api';
import { Library } from '@/models/Library';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Synchronisable } from './synchronisable';

export interface LibraryRepositoryProps {
    getAll: () => Promise<Library[]>;
    add: (name: string) => Promise<void>;
}

export class SQLiteLibraryRepository extends Synchronisable implements LibraryRepositoryProps {
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

export class APILibraryRepository implements LibraryRepositoryProps {
    async getAll(): Promise<Library[]> {
        return [];
    }

    async add(name: string): Promise<void> {
        return;
    }
}
