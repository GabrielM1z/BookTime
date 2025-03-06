import { SynchronisationController } from "@/controllers/SynchronisationController";
import { CreateFormatDto, DeleteFormatDto, Format, UpdateFormatDto } from "@/models/Format";
import { CrudRepository } from "@/types/repositories";
import { SQLiteDatabase } from 'expo-sqlite';
import { BaseLocalRepository } from "./base/BaseRepository";

export interface FormatRepository extends CrudRepository<
    Format, CreateFormatDto, UpdateFormatDto, DeleteFormatDto
> { }

export class LocalFormatRepository extends BaseLocalRepository<Format> implements FormatRepository {
    private sync: SynchronisationController;

    constructor(db: SQLiteDatabase, sync: SynchronisationController) {
        super("format", db);
        this.sync = sync;
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
        await this.create_base(format);
    }

    async update(format: UpdateFormatDto): Promise<void> {
        await this.update_base(format, ['id_format']);
    }

    async delete(format: DeleteFormatDto): Promise<void> {
        await this.delete_base(format);
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

    async update(format: UpdateFormatDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(format: DeleteFormatDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
}