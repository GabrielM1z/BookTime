import { SynchronisationProxy } from "@/controllers/SynchronisationProxy";
import { CreateStateDto, DeleteStateDto, State, UpdateStateDto } from "@/models/State";
import { Context, CrudRepository } from "@/types/repositories";
import { SQLiteDatabase } from 'expo-sqlite';
import { BaseLocalRepository } from "./base/BaseRepository";

export interface StateRepository extends CrudRepository<
    State, CreateStateDto, UpdateStateDto, DeleteStateDto
> { }

export class LocalStateRepository extends BaseLocalRepository<State> implements StateRepository {
    private id_user: string;
    private sync: SynchronisationProxy;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationProxy) {
        super("state", db);
        this.id_user = id_user;
        this.sync = sync;
    }

    async get(id: string): Promise<State> {
        throw new Error("Method not implemented.");
    }

    async getAll(): Promise<State[]> {
        let allRows = await this.db.getAllAsync<State>(
            'SELECT * FROM state'
        );
        return allRows;
    }

    async create(state: CreateStateDto): Promise<void> {
        await this.create_base(state);
    }

    async update(state: UpdateStateDto): Promise<void> {
        await this.update_base(state, ["id_user", "id_book"]);
    }

    async delete(state: DeleteStateDto): Promise<void> {
        await this.delete_base(state);
    }
}

export class RemoteStateRepository implements StateRepository {
    async get(id: string): Promise<State> {
        throw new Error("Method not implemented.");
    }
    
    async getAll(): Promise<State[]> {
        throw new Error("Method not implemented.");
    }

    async create(state: CreateStateDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async update(state: UpdateStateDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(state: DeleteStateDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
