import { useApi } from '@/hooks/useApi';
import { Library } from '@/models/library';
import { Api } from '@/services/api';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';

export interface LibraryRepositoryProps {
    getAll: () => Promise<Library[]>;
    add: (name: string) => Promise<void>;
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

    async add(name: string): Promise<void> {
        const statement = await this.db.prepareAsync(
            'INSERT INTO library (name) VALUES ($name);'
        );

        await statement.executeAsync({
            $name: name
        });
    }
}

export class APILibraryRepository implements LibraryRepositoryProps {
    private api: Api;

    constructor() {
        this.api = useApi();
    }
    
    async getAll(): Promise<Library[]> {
        return [];
    }

    async add(name: string): Promise<void> {
        return;
    }
}
