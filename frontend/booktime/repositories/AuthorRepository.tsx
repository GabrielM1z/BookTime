import { Author } from '@/models/Author';
import { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';
import { SynchronisationController } from '@/controllers/SynchronisationController';


export interface AuthorRepository {
    getAll: () => Promise<Author[]>
    get: (id: string) => Promise<Author | null>;
    getFromIdBooks: (idBook: string) => Promise<Author[]>
    add: (author: Author) => Promise<void>;
}

export class LocalAuthorRepository implements AuthorRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationController;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationController) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
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

    async getFromIdBooks(idBook: string): Promise<Author[]> {
        try {
            let allRowsFromIdBook = await this.db.getAllAsync<Author>(
                `SELECT * FROM author 
                LEFT JOIN book_author ON author.id_author = book_author.id_author
                WHERE book_author.id_book = $idBook
                `, {$idBook: idBook}
            );
            console.log(allRowsFromIdBook);
            
            return allRowsFromIdBook;

        } catch (error) {
            console.log("Error getFromIdBooks :", error);
            return []
            
        }
    }

    async createAll(listNewAuthors: Author[]): Promise<void> {
        console.log("Création liste auteurs :",listNewAuthors);
        
        const insertAuthor = await this.db.prepareAsync(
            'INSERT OR IGNORE INTO author (id_author, name, description) VALUES ($id_author, $name, $description);'
        );

        try {

            for (const author of listNewAuthors) {
                await insertAuthor.executeAsync({
                    $id_author: author.id_author,
                    $name: author.name,
                    $description: author.description,
                });

            }

        }finally {
            await insertAuthor.finalizeAsync();
        }
        
    }

    async add(author: Author): Promise<void> {
        const statement = await this.db.prepareAsync(
            'INSERT INTO author (id_author, first_name, last_name, description) VALUES ($id_author, $first_name, $last_name, $description);'
        );

        await statement.executeAsync({
            $id_author: uuidv4(),
            $name: author.name,
            $description: author.description
        });
    }
}


export class RemoteAuthorRepository implements AuthorRepository {
    async getAll(): Promise<Author[]> {
        return [];
    }

    async get(id: string): Promise<Author | null> {
        return null;
    }

    async getFromIdBooks(idBook: string): Promise<Author[]> {
        return [    ];
    }

    async add(author: Author): Promise<void> {
        return;
    }
}