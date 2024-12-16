import { Library } from '@/models/Library';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { syncDB } from '@/core/syncService';

export interface LibraryRepositoryProps {
    getAll: () => Promise<Library[]>;
    get: (id: string) => Promise<Library|null>;
    add: (name: string, actionRepository: ActionRepository) => Promise<void>;
}

export class SQLiteLibraryRepository implements LibraryRepositoryProps {
    private db: SQLiteDatabase;

    constructor() {
        this.db = useSQLiteContext();
    }

    async getAll(): Promise<Library[]> {
        let allRows = await this.db.getAllAsync<Library>(
            'SELECT * FROM library'
        );
        return allRows;
    }

    async get(id: string): Promise<Library|null> {
        const statement = await this.db.prepareAsync(
            'SELECT * FROM library WHERE id_library == $id'
        );

        const result = await statement.executeAsync({
            $id: id
        });

        return result ? (result as unknown as Library) : null;
    }

    async add(name: string, actionRepository: ActionRepository): Promise<void> {
        const statement = await this.db.prepareAsync(
            'INSERT INTO library (name) VALUES ($name);'
        );

        syncDB(actionRepository)
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

    async get(id: string): Promise<Library|null> {
        return null;
    }

    async add(name: string): Promise<void> {
        return;
    }
}
