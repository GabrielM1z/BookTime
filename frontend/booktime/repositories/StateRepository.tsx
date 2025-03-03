import { SynchronisationController } from "@/controllers/SynchronisationController";
import { State } from "@/models/State";
import { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';
import uuid from 'react-native-uuid';


export interface StateRepository {
    getAll: () => Promise<State[]>;
    get: (id: string) => Promise<State | null>;
}

export class LocalStateRepository implements StateRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationController;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationController) {
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

    async get(id: string): Promise<State | null> {
        const statement = await this.db.prepareAsync(
            'SELECT * FROM state WHERE id_state == $id'
        );

        const result = await statement.executeAsync({
            $id: id
        });

        return result ? (result as unknown as State) : null;
    }

    async create(state: State): Promise<void> {
        try {
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

        } catch (error) {
            console.log("create :", error);

        }
    }
}


export class RemoteStateRepository implements StateRepository {
    async getAll(): Promise<State[]> {
        return [];
    }

    async get(id: string): Promise<State | null> {
        return null;
    }

    async add(state: State): Promise<void> {
        return;
    }
}