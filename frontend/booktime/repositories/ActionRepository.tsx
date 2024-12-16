import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Action } from '@/models/Action';
import { Trigger } from '@/models/Trigger';

export interface ActionRepositoryProps {
    getAll: () => Promise<Action[]>;
    getTrigger: () => Promise<Trigger[]>;
}

export class ActionRepository implements ActionRepositoryProps {
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

    async get(id: string): Promise<Action|null> {
        const statement = await this.db.prepareAsync(
            'SELECT * FROM action WHERE id_action == $id'
        );

        const result = await statement.executeAsync({
            $id: id
        });

        return result ? (result as unknown as Action) : null;
    }

    async getTrigger(): Promise<Trigger[]> {
        let allRows = await this.db.getAllAsync<Trigger>(
            'SELECT name, tbl_name,type, sql FROM sqlite_master WHERE type = \'trigger\';'
        );
        return allRows;
    }

}