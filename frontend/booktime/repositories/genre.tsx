import { Genre } from "@/models/Genre";
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { syncDB } from '@/core/syncService';


export interface GenreRepositoryProps {
    getAll: () => Promise<Genre[]>
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

    async add(name: string): Promise<void> {
        return;
    }
}


export class APIGenreRepository implements GenreRepositoryProps {
    async getAll(): Promise<Genre[]> {
        return [];
    }

    async add(name: string): Promise<void> {
        return;
    }
}