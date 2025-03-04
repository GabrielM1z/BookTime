/**
 * A generic type used for creating DTOs (Data Transfer Objects) for creation operations.
 * This type creates a DTO that mirrors the original model without omitting any fields, 
 * making it useful when creating a new entity where all fields, including the ID, are provided.
 * 
 * @template T - The original model type (e.g., `Book`, `Author`).
 * 
 * Example:
 * ```typescript
 * type CreateBookDto = CreateDto<Book>;
 * ```
 * This type would keep all the fields in `Book` model, including the `id_book` field, for creating a new `Book`.
 */
export type CreateDtoStrictId<T extends Record<string, any>> = T;


/**
 * A generic type that allows creating DTOs (Data Transfer Objects) where the primary key (ID)
 * is optional, enabling automatic generation by the database if not provided.
 * 
 * By default, the ID field in the original model is required. This utility type makes it optional,
 * allowing flexibility in entity creation.
 * 
 * @template T - The original model type (e.g., `Book`, `Author`).
 * @template IdField - The key of the ID field in the model (e.g., `"id_book"`, `"id_author"`).
 * 
 * Example:
 * ```typescript
 * type CreateBookDto = CreateDtoAutoId<Book, "id_book">;
 * ```
 * This makes `id_book` optional in `CreateBookDto`, allowing database-generated IDs.
 */
export type CreateDtoAutoId<T extends Record<string, any>, IdField extends keyof T> = Omit<T, IdField> & {
    [K in IdField]?: T[K]; // Makes the ID field optional
};

/**
 * A generic type used for creating DTOs (Data Transfer Objects) for update operations,
 * where the ID field is omitted, and only the updatable fields are retained.
 * 
 * When updating an entity, the ID is not required in the DTO, as it's implicitly known 
 * and typically passed separately for locating the record. All other fields except the ID 
 * are kept for modification.
 * 
 * @template T - The original model type (e.g., `Book`, `Author`).
 * @template IdField - The key of the ID field (e.g., `"id_book"`, `"id_author"`).
 * 
 * Example:
 * ```typescript
 * type UpdateBookDto = UpdateDto<Book, "id_book">;
 * ```
 * This type would remove `id_book` from the DTO for updating a `Book`.
 */
export type UpdateDto<T extends Record<string, any>, IdField extends keyof T> = Omit<T, IdField>;

/**
 * A generic type used for creating DTOs (Data Transfer Objects) for deletion operations in 
 * junction tables, where only the fields that form the composite primary key (IDs) are required.
 * 
 * All other fields in the model are omitted, leaving only the IDs that form the primary key.
 * This is useful when performing delete operations where we only need the identifying keys 
 * for the relation between the entities in the junction table.
 * 
 * @template T - The original model type (e.g., `BookAuthor`, `AuthorBook`).
 * @template IdFields - A tuple of keys representing the fields that form the composite primary key (e.g., `["id_book", "id_author"]`).
 * 
 * Example:
 * ```typescript
 * type DeleteBookAuthorDto = DeleteDtoJunction<BookAuthor, ["id_book", "id_author"]>;
 * ```
 * This type would only include the `id_book` and `id_author` in the DTO for deletion.
 */
export type DeleteDtoJunction<T extends Record<string, any>, IdFields extends (keyof T)[]> = {
    // Only keep the fields that are part of the composite primary key.
    [K in IdFields[number]]: T[K];
};

/**
 * Interface for CRUD operations on a regular table.
 * 
 * For regular tables, operations are straightforward where each entity has a single ID as primary key.
 */
export interface CrudRepository<T extends Record<string, any>> {
    get(id: string): Promise<T | null>;
    create(data: CreateDtoStrictId<T> | CreateDtoAutoId<T, any>): Promise<void>;
    update(id: string, data: UpdateDto<T, any>): Promise<void>;
    delete(id: string): Promise<void>;
}

/**
 * Interface for CRUD operations on a junction table.
 * 
 * For junction tables, each entity is connected through a composite primary key.
 * CRUD operations are more complex as they involve both foreign key fields (usually two or more).
 */
export interface CrudJunctionRepository<T extends Record<string, any>> {
    get?(id1: string, id2: string): Promise<T | null>;
    create(data: CreateDtoStrictId<T>): Promise<void>;
    update?(id1: string, id2: string, data: UpdateDto<T, any>): Promise<void>;
    delete(data: DeleteDtoJunction<T, any>): Promise<void>;
}

/**
 * Combined interface that can handle both regular and junction tables.
 * This interface is flexible, depending on the repository type, and excludes 'get'.
 */
export type CrudRepositoryWithoutGet<T extends Record<string, any>> =
    | (Omit<CrudRepository<T>, 'get'>)
    | (Omit<CrudJunctionRepository<T>, 'get'>);
