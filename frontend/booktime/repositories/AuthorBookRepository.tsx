import { SynchronisationController } from "@/controllers/SynchronisationController";
import { AuthorBook } from "@/models/AuthorBook";
import { LibraryBook } from "@/models/LibraryBook";
import { SQLiteDatabase } from 'expo-sqlite';
import uuid from 'react-native-uuid';



export interface AuthorBookRepository {
    create: (newAuthorBook: AuthorBook) => Promise<void>;
    createAll: (listNewAuthorBook: AuthorBook[]) => Promise<void>;

}

export class LocalAuthorBookRepository implements AuthorBookRepository {
    private db: SQLiteDatabase;
    private id_user: string;
    private sync: SynchronisationController;

    constructor(db: SQLiteDatabase, id_user: string, sync: SynchronisationController) {
        this.db = db;
        this.id_user = id_user;
        this.sync = sync;
    }

    async create(newAuthorBook: AuthorBook) : Promise<void>{
        await this.db.runAsync(
            `INSERT OR IGNORE INTO book_author (id_author, id_book) VALUES ($id_author, $id_book);`,
            {
                $id_author: newAuthorBook.id_author,
                $id_book: newAuthorBook.id_book,
            }
        )
    }

    async createAll(listNewAuthorBook: AuthorBook[]) : Promise<void>{

        const insertAuthorBook = await this.db.prepareAsync(
            `INSERT OR IGNORE INTO book_author (id_author, id_book) VALUES ($id_author, $id_book);`,
        );
        
        try {
            for (const newAuthorBook of listNewAuthorBook) {
    
                await insertAuthorBook.executeAsync({
                    $id_author: newAuthorBook.id_author,
                    $id_book: newAuthorBook.id_book,
                });
            }
        }finally {
            await insertAuthorBook.finalizeAsync();
        }
    }

}


export class RemoteAuthorBookRepository implements AuthorBookRepository {

    constructor() {
    }
    
    async create(newAuthorBook: AuthorBook): Promise<void> {
    }

    async createAll(listNewAuthorBook: AuthorBook[]): Promise<void> {

    }

}