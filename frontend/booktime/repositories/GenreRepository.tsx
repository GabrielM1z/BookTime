import { CreateGenreDto, Genre, UpdateGenreDto } from "@/models/Genre";
import { SQLiteDatabase } from 'expo-sqlite';
import { SynchronisationProxy } from "@/controllers/SynchronisationProxy";
import { CrudRepository } from "@/types/repositories";

export interface GenreRepository extends CrudRepository<Genre> {
    get: (id: string) => Promise<Genre>;
    getAll: () => Promise<Genre[]>
    create: (genre: CreateGenreDto) => Promise<void>;
    update: (id: string, genre: UpdateGenreDto) => Promise<void>;
    delete: (id: string) => Promise<void>;
}

export class LocalGenreRepository implements GenreRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationProxy;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationProxy) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async get(id: string): Promise<Genre> {
        const result = await this.db.getFirstAsync<Genre>(
            `SELECT * FROM genre WHERE id_genre = $id;`,
            { $id: id }
        );
        return result!;
    }

    async getAll(): Promise<Genre[]> {
        let allRows = await this.db.getAllAsync<Genre>(
            `SELECT * FROM genre;`
        );
        return allRows;
    }

    async create(genre: Genre): Promise<void> {
        await this.db.runAsync(
            `INSERT INTO genre (id_genre, name) VALUES ($id, $name);`,
            { $id: genre.id_genre, $name: genre.name }
        );
    }

    async update(id: string, genre: UpdateGenreDto): Promise<void> {
        await this.db.runAsync(
            `UPDATE genre SET name = $name WHERE id_genre = $id`,
            { $id: id, $name: genre.name }
        );
    }

    async delete(id: string): Promise<void> {
        await this.db.runAsync(
            `DELETE FROM genre WHERE id_genre = $id`,
            { $id: id }
        );
    }
}

export class RemoteGenreRepository implements GenreRepository {
    async get(id: string): Promise<Genre> {
        throw new Error("Method not implemented.");
    }
    
    async getAll(): Promise<Genre[]> {
        throw new Error("Method not implemented.");
    }

    async create(genre: CreateGenreDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, genre: UpdateGenreDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
