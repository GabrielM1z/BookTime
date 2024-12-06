import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Action } from '@/models/action';
import { Trigger } from '@/models/trigger';



export interface ActionRepositoryProps {
    getAll: () => Promise<Action[]>;
    getTrigger: () => Promise<Trigger[]>;
}

export class SQLiteLibraryRepository implements ActionRepositoryProps {
    private db: SQLiteDatabase;

    constructor() {
        this.db = useSQLiteContext();
    }

    async getAll(): Promise<Action[]> {
        let allRows = await this.db.getAllAsync<Action>(
            'SELECT * FROM action'
        );
        return allRows;
    }

    async getTrigger(): Promise<Trigger[]> {
        let allRows = await this.db.getAllAsync<Trigger>(
            'SELECT name, tbl_name,type, sql FROM sqlite_master WHERE type = \'trigger\';'
        );
        return allRows;
    }

}