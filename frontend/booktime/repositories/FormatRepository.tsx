import { SynchronisationController } from "@/controllers/SynchronisationController";
import { CreateFormatDto, Format, UpdateFormatDto } from "@/models/Format";
import { CrudRepository } from "@/types/repositories";
import { SQLiteDatabase } from 'expo-sqlite';
import uuid from 'react-native-uuid';


export interface FormatRepository extends CrudRepository<Format> {
    get: (id: string) => Promise<Format>;
    getAll: () => Promise<Format[]>
    create: (format: CreateFormatDto) => Promise<void>;
    update: (id: string, format: UpdateFormatDto) => Promise<void>;
    delete: (id: string) => Promise<void>;
}

export class LocalFormatRepository implements FormatRepository {
    private db: SQLiteDatabase;
    private sync: SynchronisationController;

    constructor(db: SQLiteDatabase, sync: SynchronisationController) {
        this.sync = sync;
        this.db = db;
    }

    async get(id: string): Promise<Format> {
        const result = await this.db.getFirstAsync<Format>(
            `SELECT * FROM format WHERE id_format = $id_format`,
            { $id_format: id }
        );
        return result!;
    }

    async getAll(): Promise<Format[]> {
        const allRows = await this.db.getAllAsync<Format>(
            'SELECT * FROM format'
        );
        return allRows;
    }

    async create(format: CreateFormatDto): Promise<void> {
        await this.db.runAsync(
            `INSERT INTO format (id_format, name) VALUES ($id_format, $name);`,
            { $name: format.name }
        );
    }

    async update(id: string, format: UpdateFormatDto): Promise<void> {
        await this.db.runAsync(
            `UPDATE format SET name = $name WHERE id_format = $id_format;`,
            {
                $id_format: id,
                $name: format.name
            }
        );
    }

    async delete(id: string): Promise<void> {
        await this.db.runAsync(
            `DELETE FROM format WHERE id_format = $id_format;`,
            { $id_format: id }
        );
    }
}


export class RemoteFormatRepository implements FormatRepository {
    async getAll(): Promise<Format[]> {
        return [];
    }

    async get(id: string): Promise<Format> {
        throw new Error("Method not implemented.");
    }

    async create(format: CreateFormatDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, format: UpdateFormatDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}