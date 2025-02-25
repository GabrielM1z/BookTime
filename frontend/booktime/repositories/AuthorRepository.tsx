import { Author } from '@/models/Author';
import { SQLiteDatabase } from 'expo-sqlite';
import { useSQLite } from "@/hooks/useSQLite";
import { v4 as uuidv4 } from 'uuid';


export interface AuthorRepository {
    getAll: () => Promise<Author[]>
    get: (id: string) => Promise<Author | null>;
    add: (author: Author) => Promise<void>;
}

export class SQLiteAuthorRepository implements AuthorRepository {
    private db: SQLiteDatabase;

    constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    async getAll(): Promise<Author[]> {
        let allRows = await this.db.getAllAsync<Author>(
            'SELECT * FROM author'
        );
        return allRows;
    }

    async get(id: string): Promise<Author | null> {
        const statement = await this.db.prepareAsync(
            'SELECT * FROM author WHERE id_author == $id'
        );

        const result = await statement.executeAsync({
            $id: id
        });

        return result ? (result as unknown as Author) : null;
    }

    async add(author: Author): Promise<void> {
        const statement = await this.db.prepareAsync(
            'INSERT INTO author (id_author, first_name, last_name, description) VALUES ($id_author, $first_name, $last_name, $description);'
        );

        await statement.executeAsync({
            $id_author: uuidv4(),
            $first_name: author.first_name,
            $last_name: author.last_name,
            $description: author.description
        });
    }
}


export class APIAuthorRepository implements AuthorRepository {
    async getAll(): Promise<Author[]> {
        return [];
    }

    async get(id: string): Promise<Author | null> {
        return null;
    }

    async add(author: Author): Promise<void> {
        return;
    }
}