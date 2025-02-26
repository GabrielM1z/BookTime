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
    private tableName: string
    private db: SQLiteDatabase;

    constructor(tableName: string, db: SQLiteDatabase) {
        this.tableName = tableName;
        this.db = db;
    }

    async getAll(): Promise<Action[]> {
        let allRows = await this.db.getAllAsync<Action>(
            `SELECT * FROM ${this.tableName}`
        );
        return allRows;
    }

    async get(id: string): Promise<Action> {
        const action = await this.db.getFirstAsync<Action>(
            `SELECT * FROM ${this.tableName} WHERE id_action == $id`,
            { $id: id }
        );

        return action!;
    }

    async deleteAll(): Promise<void> {
        await this.db.runAsync(`DELETE FROM ${this.tableName}`);
    }

    async getTrigger(): Promise<Trigger[]> {
        let allRows = await this.db.getAllAsync<Trigger>(
            `SELECT name, tbl_name,type, sql FROM sqlite_master WHERE type = \'trigger\';`
        );
        return allRows;
    }
}
