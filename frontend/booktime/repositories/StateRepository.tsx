import { State } from "@/models/State";
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Synchronisable } from './synchronisable';


export interface StateRepositoryProps {
    getAll: () => Promise<State[]>;
    get: (id: string) => Promise<State | null>;
    add: (state: State) => Promise<void>;
}

export class SQLiteStateRepository extends Synchronisable implements StateRepositoryProps {
    private db: SQLiteDatabase;
    private api: APIStateRepository;

    constructor() {
        super();
        this.db = useSQLiteContext();
        this.api = new APIStateRepository();
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

    async add(state: State): Promise<void> {
        const statement = await this.db.prepareAsync(
            'INSERT INTO state (state, progression, read_count, last_read_date, id_user, id_book, is_available) VALUES ($state, $progression, $read_count, $last_read_date, $id_user, $id_book, $is_available);'
        );

        await statement.executeAsync({
            $state: state.state,
            $progression: state.progression,
            $read_count: state.read_count,
            $last_read_date: state.last_read_date,
            $id_user: state.id_user,
            $id_book: state.id_book,
            $is_available: state.is_available,
        });
    }
}


export class APIStateRepository implements StateRepositoryProps {
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