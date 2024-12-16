import { Genre } from "@/models/Genre";
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { syncDB } from '@/core/syncService';


export interface GenreRepositoryProps {
    getAll: () => Promise<Genre[]>
    get: (id: string) => Promise<Genre|null>;
}

export class SQLiteGenreRepository implements GenreRepositoryProps {
    private db: SQLiteDatabase;

    constructor() {
        this.db = useSQLiteContext();
    }

    async getAll(): Promise<Genre[]> {
        let allRows = await this.db.getAllAsync<Genre>(
            'SELECT * FROM genre'
        );
        return allRows;
    }

    async get(id: string): Promise<Genre|null> {
        const statement = await this.db.prepareAsync(
            'SELECT * FROM genre WHERE id_genre == $id'
        );

        const result = await statement.executeAsync({
            $id: id
        });

        return result ? (result as unknown as Genre) : null;
    }

    async add(name: string): Promise<void> {
        return;
    }
}


export class APIGenreRepository implements GenreRepositoryProps {
    async getAll(): Promise<Genre[]> {
        return [];
    }

    async get(id: string): Promise<Genre|null> {
        return null;
    }

    async add(name: string): Promise<void> {
        return;
    }
}