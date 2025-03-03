import { SynchronisationProxy } from "@/controllers/SynchronisationProxy";
import { CreateStateDto, DeleteStateDto, State, UpdateStateDto } from "@/models/State";
import { CrudJunctionRepository } from "@/types/repositories";
import { SQLiteDatabase } from 'expo-sqlite';

export interface StateRepository extends CrudJunctionRepository<State> {
    getAll: () => Promise<State[]>;
    create: (state: CreateStateDto) => Promise<void>;
    update: (id1: string, id2: string, state: UpdateStateDto) => Promise<void>;
    delete: (state: DeleteStateDto) => Promise<void>;
}

export class LocalStateRepository implements StateRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationProxy;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationProxy) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async getLastInsertedId(): Promise<string> {
        const result = await this.db.getFirstAsync<State>(
            `SELECT * FROM state ORDER BY rowid DESC LIMIT 1;`,
        );
        return (result as State).id_book;
    }

    async getAll(): Promise<State[]> {
        let allRows = await this.db.getAllAsync<State>(
            'SELECT * FROM state'
        );
        return allRows;
    }

    async create(state: CreateStateDto): Promise<void> {
        await this.db.runAsync(
            `INSERT OR IGNORE INTO state (progression, id_user, id_book, read_count)
            VALUES ($progression, $id_user, $id_book, $read_count);`,
            {
                $progression: 0,
                $id_user: state.id_user,
                $id_book: state.id_book,
                $read_count: 0,
            }
        );
    }

    async update(id_user: string, id_book: string, state: UpdateStateDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(state: DeleteStateDto): Promise<void> {
        await this.db.runAsync(
            `DELETE FROM state 
            WHERE id_user == $id_user AND id_book == $id_book;`,
            { $id_user: state.id_user, $id_book: state.id_book }
        );
    }
}

export class RemoteStateRepository implements StateRepository {
    async getAll(): Promise<State[]> {
        throw new Error("Method not implemented.");
    }

    async create(state: CreateStateDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async update(id1: string, id2: string, state: UpdateStateDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(state: DeleteStateDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
