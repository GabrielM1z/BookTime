import { Context, CreateDtoAutoId, CreateDtoStrictId, DeleteDto, UpdateDto } from "@/types/repositories";
import { SQLiteDatabase } from "expo-sqlite";

export class BaseRepository<T extends Record<string, any>> {

}

export class BaseLocalRepository<T extends Record<string, any>> extends BaseRepository<T> {
    protected db: SQLiteDatabase;
    protected tableName: string;

    constructor(tableName: string, db: SQLiteDatabase) {
        super();
        this.db = db;
        this.tableName = tableName;
    }

    async getLastInserted(): Promise<T | null> {
        const result = await this.db.getFirstAsync<T>(
            `SELECT * FROM ${this.tableName} WHERE rowid = last_insert_rowid();`
        );
        return result;
    }

    _params<T extends Record<string, any>>(data: Partial<T>): Record<string, any> {
        const params: Record<string, any> = {};
        for (const key of Object.keys(data)) {
            params[`$${String(key)}`] = data[key as keyof T];
        }
        return params;
    }

    _formatColumns(columns: string[], defaultColumns: string[] = []): string {
        if (columns.length === 0) {
            return "*";
        } else {
            const combinedColumns = new Set([...columns, ...defaultColumns]);
            return Array.from(combinedColumns).join(", ");
        }
    }

    async get_base(data: Record<string, any>, columns: (keyof T)[] = [], context?: Context): Promise<T> {
        const args = this._formatColumns(columns, Object.keys(data));
        const whereClause = Object.keys(data)
            .map(key => `${key} = $${key}`)
            .join(" AND ");
        const params = this._params(data);

        const result = await this.db.getFirstAsync<T>(
            `SELECT ${args} FROM ${this.tableName} WHERE ${whereClause};`,
            params
        );

        return result!;
    }

    async getAll_base(columns: (keyof T)[] = [], context?: Context): Promise<T[]> {
        const args = this._formatColumns(columns);
        const allRows = await this.db.getAllAsync<T>(
            `SELECT ${args} FROM ${this.tableName};`
        );

        return allRows;
    }

    async create_base<IdField extends keyof T>(
        data: CreateDtoStrictId<T> | CreateDtoAutoId<T, IdField>,
        ignore: boolean = true,
        context?: Context
    ): Promise<void> {
        const columns = Object.keys(data as Partial<T>).join(", ");
        const values = Object.keys(data as Partial<T>).map(key => `$${String(key)}`).join(", ");
        const params = this._params(data);
        const ignoreClause = ignore ? " OR IGNORE" : "";

        await this.db.runAsync(
            `INSERT${ignoreClause} INTO ${this.tableName} (${columns}) VALUES (${values});`,
            params
        );
    }

    async update_base<IdFields extends [keyof T, ...Array<keyof T>]>(
        data: UpdateDto<T, IdFields>,
        idFields: IdFields,
        context?: Context
    ): Promise<void> {
        const updateFields = Object.keys(data).filter(key => !(idFields as string[]).includes(key));

        if (updateFields.length === 0) {
            throw new Error("No fields to update.");
        }

        const setClause = updateFields.map(field => `${field} = $${field}`).join(", ");
        const whereClause = idFields.map(id => `${String(id)} = $${String(id)}`).join(" AND ");
        const params = this._params(data);

        await this.db.runAsync(
            `UPDATE ${this.tableName} SET ${setClause} WHERE ${whereClause};`,
            params
        );
    }

    async delete_base<IdFields extends [keyof T, ...Array<keyof T>]>(
        data: DeleteDto<T, IdFields>,
        context?: Context
    ): Promise<void> {
        const whereClause = Object.keys(data)
            .map(id => `${String(id)} = $${String(id)}`)
            .join(" AND ");

        const params = this._params(data);

        await this.db.runAsync(
            `DELETE FROM ${this.tableName} WHERE ${whereClause};`,
            params
        );
    }
}
