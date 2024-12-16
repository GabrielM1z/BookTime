import { Format } from "@/models/Format";
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { syncDB } from '@/core/syncService';


export interface FormatRepositoryProps {
    getAll: () => Promise<Format[]>
    get: (id: string) => Promise<Format|null>;
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

    async get(id: string): Promise<Format|null> {
        const statement = await this.db.prepareAsync(
            'SELECT * FROM format WHERE id_format == $id'
        );

        const result = await statement.executeAsync({
            $id: id
        });

        return result ? (result as unknown as Format) : null;
    }

    async add(name: string): Promise<void> {
        return;
    }
}


export class APIFormatRepository implements FormatRepositoryProps {
    async getAll(): Promise<Format[]> {
        return [];
    }

    async get(id: string): Promise<Format|null> {
        return null;
    }

    async add(name: string): Promise<void> {
        return;
    }
}