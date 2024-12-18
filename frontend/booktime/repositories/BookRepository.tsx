import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Synchronisable } from './synchronisable';


export interface BookRepository {

}

export class SQLiteBookRepository extends Synchronisable implements BookRepository {
    private db: SQLiteDatabase;
    private api: APIBookRepository;

    constructor() {
        super();
        this.db = useSQLiteContext();
        this.api = new APIBookRepository();
    }

}

export class APIBookRepository implements BookRepository {

}
