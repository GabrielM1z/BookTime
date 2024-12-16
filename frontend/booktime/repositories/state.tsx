import { State } from "@/models/State";
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { syncDB } from '@/core/syncService';


export interface StateRepositoryProps {
    getAll: () => Promise<State[]>
}

export class SQLiteStateRepository implements StateRepositoryProps {
    private db: SQLiteDatabase;

    constructor() {
        this.db = useSQLiteContext();
    }

    async getAll(): Promise<State[]> {
        let allRows = await this.db.getAllAsync<State>(
            'SELECT * FROM state'
        );
        return allRows;
    }

    async add(name: string): Promise<void> {
        return;
    }
}


export class APIStateRepository implements StateRepositoryProps {
    async getAll(): Promise<State[]> {
        return [];
    }

    async add(name: string): Promise<void> {
        return;
    }
}