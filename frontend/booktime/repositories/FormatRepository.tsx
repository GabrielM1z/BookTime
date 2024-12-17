import { Format } from "@/models/Format";
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Synchronisable } from './synchronisable';


export interface FormatRepositoryProps {
    getAll: () => Promise<Format[]>
    get: (id: string) => Promise<Format | null>;
    add: (format: Format) => Promise<void>;
}

export class SQLiteFormatRepository extends Synchronisable implements FormatRepositoryProps {
    private db: SQLiteDatabase;
    private api: APIFormatRepository;

    constructor() {
        super();
        this.db = useSQLiteContext();
        this.api = new APIFormatRepository();
    }

    async getAll(): Promise<Format[]> {
        let allRows = await this.db.getAllAsync<Format>(
            'SELECT * FROM format'
        );
        return allRows;
    }

    async get(id: string): Promise<Format | null> {
        const statement = await this.db.prepareAsync(
            'SELECT * FROM format WHERE id_format == $id'
        );

        const result = await statement.executeAsync({
            $id: id
        });

        return result ? (result as unknown as Format) : null;
    }

    async add(format: Format): Promise<void> {
        const statement = await this.db.prepareAsync(
            'INSERT INTO format (name) VALUES ($name);'
        );

        await statement.executeAsync({
            $name: format.name
        });
    }
}


export class APIFormatRepository implements FormatRepositoryProps {
    async getAll(): Promise<Format[]> {
        return [];
    }

    async get(id: string): Promise<Format | null> {
        return null;
    }

    async add(format: Format): Promise<void> {
        return;
    }
}