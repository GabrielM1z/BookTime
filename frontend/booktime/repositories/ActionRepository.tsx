import { Action, ActionEncoded } from '@/models/Action';
import { Trigger } from '@/models/Trigger';
import { CreateDtoStrictId } from '@/types/repositories';
import { SQLiteDatabase } from 'expo-sqlite';
import { BaseLocalRepository } from './base/BaseRepository';
import { actionEncode } from '@/helpers/parser';

export interface ActionRepository {
    getAll: () => Promise<Action[]>;
    deleteAll: () => Promise<void>;
    getTrigger: () => Promise<Trigger[]>;
}

export class LocalActionRepository extends BaseLocalRepository<Action | ActionEncoded> implements ActionRepository {
    private idUser: string;
    
    constructor(tableName: string, db: SQLiteDatabase, idUser: string) {
        super(tableName, db);
        this.idUser = idUser;
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

    async createInsert(data: CreateDtoStrictId<any>, tableName: string): Promise<void> {
        const action: ActionEncoded = {
            date: new Date().toISOString(),
            executed_by: "CLIENT",
            table_name: tableName,
            id_user: this.idUser,
            type: "INSERT",
            action: actionEncode(data),
        }
        await this.create_base(action);
    }

    async createUpdate(data: CreateDtoStrictId<any>, tableName: string): Promise<void> {
        const action: ActionEncoded = {
            date: new Date().toISOString(),
            executed_by: "CLIENT",
            table_name: tableName,
            id_user: this.idUser,
            type: "UPDATE",
            action: actionEncode(data),
        }
        await this.create_base(action);
    }

    async createDelete(data: CreateDtoStrictId<any>, tableName: string): Promise<void> {
        const action: ActionEncoded = {
            date: new Date().toISOString(),
            executed_by: "CLIENT",
            table_name: tableName,
            id_user: this.idUser,
            type: "DELETE",
            action: actionEncode(data),
        }
        await this.create_base(action);
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
