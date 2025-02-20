import { SQLiteDatabase } from 'expo-sqlite';
import { useSQLite } from "@/hooks/useSQLite";
import { Action } from '@/models/Action';
import { Trigger } from '@/models/Trigger';

export interface ActionRepository {
    getAll: () => Promise<Action[]>;
    deleteAll: () => Promise<void>;
    getTrigger: () => Promise<Trigger[]>;
}

export class SQLiteActionRepository implements ActionRepository {
    private db: SQLiteDatabase;

    constructor() {
        this.db = useSQLite().db;
    }

    async getAll(): Promise<Action[]> {
        let allRows = await this.db.getAllAsync<Action>(
            'SELECT * FROM action'
        );
        return allRows;
    }

    async get(id: string): Promise<Action|null> {
        const statement = await this.db.prepareAsync(
            'SELECT * FROM action WHERE id_action == $id'
        );

        const result = await statement.executeAsync({
            $id: id
        });

        return result ? (result as unknown as Action) : null;
    }

    async deleteAll(): Promise<void> {
        await this.db.execAsync('DELETE FROM action');
    }

    async getTrigger(): Promise<Trigger[]> {
        let allRows = await this.db.getAllAsync<Trigger>(
            'SELECT name, tbl_name,type, sql FROM sqlite_master WHERE type = \'trigger\';'
        );
        return allRows;
    }

}