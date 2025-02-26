import { SynchronisationController } from "@/controllers/SynchronisationController";
import { Genre } from "@/models/Genre";
import { SQLiteDatabase } from 'expo-sqlite';
import uuid from 'react-native-uuid';



export interface GenreRepository {
    getAll: () => Promise<Genre[]>
    get: (id: string) => Promise<Genre | null>;
    add: (genre: Genre) => Promise<void>;
}

export class LocalGenreRepository implements GenreRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationController;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationController) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async getAll(): Promise<Genre[]> {
        let allRows = await this.db.getAllAsync<Genre>(
            'SELECT * FROM genre'
        );
        return allRows;
    }

    async get(id: string): Promise<Genre | null> {
        const statement = await this.db.prepareAsync(
            'SELECT * FROM genre WHERE id_genre == $id'
        );

        const result = await statement.executeAsync({
            $id: id
        });

        return result ? (result as unknown as Genre) : null;
    }

    async add(genre: Genre): Promise<void> {
        const statement = await this.db.prepareAsync(
            'INSERT INTO genre (id_genre, name) VALUES ($id_genre, $name);'
        );

        await statement.executeAsync({
            $id_genre: uuid.v4(),
            $name: genre.name
        });
    }
}


export class RemoteGenreRepository implements GenreRepository {
    async getAll(): Promise<Genre[]> {
        return [];
    }

    async get(id: string): Promise<Genre | null> {
        return null;
    }

    async add(genre: Genre): Promise<void> {
        return;
    }
}