import { CreateGenreDto, DeleteGenreDto, Genre, UpdateGenreDto } from "@/models/Genre";
import { CrudRepository } from "@/types/repositories";
import { SQLiteDatabase } from 'expo-sqlite';
import { BaseLocalRepository } from "./base/BaseRepository";

export interface GenreRepository extends CrudRepository<
    Genre, CreateGenreDto, UpdateGenreDto, DeleteGenreDto
> { }

export class LocalGenreRepository extends BaseLocalRepository<Genre> implements GenreRepository {
    private id_user: string;

    constructor(db: SQLiteDatabase, id_user: string) {
        super("genre", db);
        this.id_user = id_user;
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
        await this.create_base(genre);
    }

    async update(genre: UpdateGenreDto): Promise<void> {
        await this.update_base(genre, ["id_genre"]);
    }

    async delete(genre: DeleteGenreDto): Promise<void> {
        await this.delete_base(genre);
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

    async update(genre: UpdateGenreDto): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(genre: DeleteGenreDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
