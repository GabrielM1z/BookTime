import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { syncDB } from '@/core/syncService';
import { Author } from '@/models/Author';


export interface AuthorRepositoryProps {
    getAll: () => Promise<Author[]>
}

export class SQLiteAuthorRepository implements AuthorRepositoryProps {
    private db: SQLiteDatabase;

    constructor() {
        this.db = useSQLiteContext();
    }

    async getAll(): Promise<Author[]> {
        let allRows = await this.db.getAllAsync<Author>(
            'SELECT * FROM author'
        );
        return allRows;
    }

    async add(name: string): Promise<void> {
        return;
    }
}


export class APIAuthorRepository implements AuthorRepositoryProps {
    async getAll(): Promise<Author[]> {
        return [];
    }

    async add(name: string): Promise<void> {
        return;
    }
}