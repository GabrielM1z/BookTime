import { SynchronisationController } from "@/controllers/SynchronisationController";
import { Format } from "@/models/Format";
import { SQLiteDatabase } from 'expo-sqlite';
import uuid from 'react-native-uuid';


export interface FormatRepository {
    getAll: () => Promise<Format[]>
    get: (id: string) => Promise<Format | null>;
    add: (format: Format) => Promise<void>;
}

export class LocalFormatRepository implements FormatRepository {
    private db: SQLiteDatabase;
    private sync: SynchronisationController;

    constructor(db: SQLiteDatabase, sync: SynchronisationController) {
        this.sync = sync;
        this.db = db;
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
            'INSERT INTO format (id_format, name) VALUES ($id_format, $name);'
        );

        await statement.executeAsync({
            $id_format: uuid.v4(),
            $name: format.name
        });
    }
}


export class RemoteFormatRepository implements FormatRepository {
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