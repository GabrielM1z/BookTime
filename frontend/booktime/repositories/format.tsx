import { Format } from "@/models/Format";
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { syncDB } from '@/core/syncService';


export interface FormatRepositoryProps {
    getAll: () => Promise<Format[]>
}

export class SQLiteFormatRepository implements FormatRepositoryProps {
    private db: SQLiteDatabase;

    constructor() {
        this.db = useSQLiteContext();
    }

    async getAll(): Promise<Format[]> {
        let allRows = await this.db.getAllAsync<Format>(
            'SELECT * FROM format'
        );
        return allRows;
    }

    async add(name: string): Promise<void> {
        return;
    }
}


export class APIFormatRepository implements FormatRepositoryProps {
    async getAll(): Promise<Format[]> {
        return [];
    }

    async add(name: string): Promise<void> {
        return;
    }
}