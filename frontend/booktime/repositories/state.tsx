import { State } from "@/models/State";
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { syncDB } from '@/core/syncService';


export interface StateRepositoryProps {
    getAll: () => Promise<State[]>;
    get: (id: string) => Promise<State|null>;;
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

    async get(id: string): Promise<State|null> {
        const statement = await this.db.prepareAsync(
            'SELECT * FROM state WHERE id_state == $id'
        );

        const result = await statement.executeAsync({
            $id: id
        });

        return result ? (result as unknown as State) : null;
    }

    async add(name: string): Promise<void> {
        return;
    }
}


export class APIStateRepository implements StateRepositoryProps {
    async getAll(): Promise<State[]> {
        return [];
    }

    async get(id: string): Promise<State|null> {
        return null;
    }

    async add(name: string): Promise<void> {
        return;
    }
}