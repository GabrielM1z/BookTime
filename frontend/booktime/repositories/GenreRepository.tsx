import { Genre } from "@/models/Genre";
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Synchronisable } from './synchronisable';
import uuid from 'react-native-uuid';



export interface GenreRepository {
    getAll: () => Promise<Genre[]>
    get: (id: string) => Promise<Genre | null>;
    add: (genre: Genre) => Promise<void>;
}

export class SQLiteGenreRepository extends Synchronisable implements GenreRepository {
    private db: SQLiteDatabase;
    private api: APIGenreRepository;

    constructor() {
        super();
        this.db = useSQLiteContext();
        this.api = new APIGenreRepository();
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


export class APIGenreRepository implements GenreRepository {
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