import { Author, CreateAuthorDto, DeleteAuthorDto, UpdateAuthorDto } from '@/models/Author';
import { CrudRepository } from '@/types/repositories';
import { SQLiteDatabase } from 'expo-sqlite';
import { BaseLocalRepository } from './base/BaseRepository';

export interface AuthorRepository extends CrudRepository<
    Author, CreateAuthorDto, UpdateAuthorDto, DeleteAuthorDto
> { }

export class LocalAuthorRepository extends BaseLocalRepository<Author> implements AuthorRepository {
    private id_user: string;

    constructor(db: SQLiteDatabase, id_user: string) {
        super("author", db);
        this.id_user = id_user;
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
        await this.create_base(author);
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

    async update(author: UpdateAuthorDto): Promise<void> {
        await this.update_base(author, ["id_author"]);
    }

    async delete(author: DeleteAuthorDto): Promise<void> {
        await this.delete_base(author)
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

    async update(author: UpdateAuthorDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(author: DeleteAuthorDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
}