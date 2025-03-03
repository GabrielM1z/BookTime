import { Author, CreateAuthorDto, UpdateAuthorDto } from '@/models/Author';
import { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';
import { SynchronisationProxy } from "@/controllers/SynchronisationProxy";
import { CrudRepository } from '@/types/repositories';

export interface AuthorRepository extends CrudRepository<Author> {
    getAll: () => Promise<Author[]>
    get: (id: string) => Promise<Author>;
    create: (author: CreateAuthorDto) => Promise<void>;
    update: (id: string, author: UpdateAuthorDto) => Promise<void>;
    delete: (id: string) => Promise<void>;
}

export class LocalAuthorRepository implements AuthorRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationProxy;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationProxy) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async getAll(): Promise<Author[]> {
        let allRows = await this.db.getAllAsync<Author>(
            `SELECT * FROM author;`
        );
        return allRows;
    }

    async get(id: string): Promise<Author> {
        const result = await this.db.getFirstAsync<Author>(
            'SELECT * FROM author WHERE id_author = $id_author',
            { $id_author: id }
        );

        return result!;
    }

    async create(author: CreateAuthorDto): Promise<void> {
        await this.db.runAsync(
            `INSERT INTO author (id_author, name, description) 
            VALUES ($id_author, $name, $description);`,
            {
                $id_author: author.id_author,
                $name: author.name,
                $description: author.description
            }
        );
    }

    async createAll(listNewAuthors: CreateAuthorDto[]): Promise<void> {
        const insertAuthor = await this.db.prepareAsync(
            `INSERT OR IGNORE INTO author (id_author, name, description)
            VALUES ($id_author, $name, $description);`
        );

        try {
            for (const author of listNewAuthors) {
                await insertAuthor.executeAsync({
                    $id_author: author.id_author,
                    $name: author.name,
                    $description: author.description,
                });
            }

        } finally {
            await insertAuthor.finalizeAsync();
        }
    }

    async update(id: string, author: UpdateAuthorDto): Promise<void> {
        await this.db.runAsync(
            `UPDATE author SET name = $name, description = $description
            WHERE id_author = $id_author;`,
            {
                $id_author: id,
                $name: author.name,
                $description: author.description
            }
        );
    }

    async delete(id: string): Promise<void> {
        await this.db.runAsync(
            `DELETE FROM author WHERE id_author = $id_author;`,
            { $id_author: id }
        );
    }
}

export class RemoteAuthorRepository implements AuthorRepository {
    async get(id: string): Promise<Author> {
        throw new Error("Method not implemented.");
    }

    async getAll(): Promise<Author[]> {
        return [];
    }

    async create(author: CreateAuthorDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, author: UpdateAuthorDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}