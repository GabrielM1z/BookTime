import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Synchronisable } from './synchronisable';


export interface BookRepositoryProps {

}

export class SQLiteBookRepository extends Synchronisable implements BookRepositoryProps {
    private db: SQLiteDatabase;
    private api: APIBookRepository;

    constructor() {
        super();
        this.db = useSQLiteContext();
        this.api = new APIBookRepository();
    }

}

export class APIBookRepository implements BookRepositoryProps {

}
