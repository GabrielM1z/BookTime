import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { syncDB } from '@/core/syncService';
import { Author } from '@/models/Author';


export interface AuthorRepositoryProps {
    getAll: () => Promise<Author[]>
    get: (id: string) => Promise<Author|null>;
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

    async get(id: string): Promise<Author|null> {
        const statement = await this.db.prepareAsync(
            'SELECT * FROM author WHERE id_author == $id'
        );

        const result = await statement.executeAsync({
            $id: id
        });

        return result ? (result as unknown as Author) : null;
    }

    async add(name: string): Promise<void> {
        return;
    }
}


export class APIAuthorRepository implements AuthorRepositoryProps {
    async getAll(): Promise<Author[]> {
        return [];
    }

    async get(id: string): Promise<Author|null> {
        return null;
    }

    async add(name: string): Promise<void> {
        return;
    }
}