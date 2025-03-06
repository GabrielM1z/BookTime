import { SQLiteDatabase } from "expo-sqlite";

export type Data = Record<string, any>;

export type CreateDtoStrictId<T extends Data> = T;

export type CreateDtoAutoId<T extends Data, IdField extends keyof T> = Omit<T, IdField> & {
    [K in IdField]?: T[K]; // Makes the ID field optional
};

export type UpdateDto<T extends Data, IdFields extends [keyof T, ...Array<keyof T>]> =
    Required<Pick<T, IdFields[number]>> & Partial<Omit<T, IdFields[number]>>;

export type DeleteDto<T extends Data, IdFields extends [keyof T, ...Array<keyof T>]> = {
    [K in IdFields[number]]: T[K];
};

/**
 * Interface for CRUD operations on a regular table.
 * 
 * For regular tables, operations are straightforward where each entity has a single ID as primary key.
 */
export interface CrudRepository<
    T extends Data, 
    C extends object = CreateDtoStrictId<T> | CreateDtoAutoId<T, keyof T>, 
    // R extends object = Record<string, any>,
    U extends object = UpdateDto<T, [keyof T, ...(keyof T)[]]>, 
    D extends object = DeleteDto<T, [keyof T, ...(keyof T)[]]>
> {
    get(id: string): Promise<T | null>;
    getAll?(): Promise<T[]>;
    getFirst?(): Promise<T | null>;
    create(data: C, context?: Context): Promise<void>;
    createAll?(data: C[], context?: Context): Promise<void>;
    update(data: U, context?: Context): Promise<void>;
    updateAll?(data: U[], context?: Context): Promise<void>;
    delete(data: D, context?: Context): Promise<void>;
    deleteAll?(data: D[], context?: Context): Promise<void>;
}

/**
 * Combined interface that can handle both regular and junction tables.
 * This interface is flexible, depending on the repository type, and excludes 'get'.
 */
export type CrudRepositoryWithoutGet<T extends Data> = Omit<CrudRepository<T>, 'get'>;

export type Context = {
    // db: SQLiteDatabase;
    syncing?: boolean;
}
