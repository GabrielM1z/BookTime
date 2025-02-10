import { SQLiteDatabase } from 'expo-sqlite';
import { useSQLite } from "@/hooks/useSQLite";
import { Synchronisable } from './synchronisable';
import uuid from 'react-native-uuid';
import { Book, BookAllInfos } from '@/models/Book';
import { LibraryWithBooks } from '@/models/Library';


export interface BookRepository {
	getAll: () => Promise<BookAllInfos[]>;
	getAllFromLib: (id_lib: string) => Promise<BookAllInfos[]> 
	get: (id: string) => Promise<BookAllInfos | null>;
	add: (state: BookAllInfos) => Promise<void>;
	addBookToLibrary: (id_library: string, book: BookAllInfos) => Promise<void>
}

export class SQLiteBookRepository extends Synchronisable implements BookRepository {
	private db: SQLiteDatabase;
	private api: APIBookRepository;

	constructor() {
		super();
		this.db = useSQLite().db;
		this.api = new APIBookRepository();
	}

	async getAll(): Promise<BookAllInfos[]> {
		let allRows = await this.db.getAllAsync<BookAllInfos>(
			'SELECT * FROM book'
		);
		return allRows;
	}

	async getAllFromLib(id_library: string): Promise<BookAllInfos[]> {

		const statement = await this.db.prepareAsync(
			'SELECT * ' + 
			'FROM book ' + 
			'JOIN library_book ON book.id_book = library_book.id_book ' +
			'JOIN library ON library_book.id_library = library.id_library ' +
			'WHERE library_book.id_library == $id_library '
		);

		const result = await statement.executeAsync({
			$id_library: id_library
		})
		
		return result ? (result as unknown as BookAllInfos[]) : [];
	}

	async get(id: string): Promise<BookAllInfos | null> 
	{	
		const result = await this.db.getFirstAsync<BookAllInfos>(
			'SELECT * FROM book WHERE id_book == $id',
			{ $id: id }
		);

		return result ? result : null;
	}
	
	async add(book: BookAllInfos): Promise<void> {
		const statement = await this.db.prepareAsync(
			'INSERT INTO book (id_book, title, description, publisher, publication_date, page_number, language, cover_image_url) VALUES ($id_book, $title, $description, $publisher, $publication_date, $page_number, $language, $cover_image_url);'
		);

		await statement.executeAsync({
			$id_book: book.id_book,
			$title: book.title,
			$description: book.description,
			$publisher: book.publisher,
			$publication_date: book.publication_date,
			$page_number: book.page_number,
			$language: book.language,
			$cover_image_url: book.cover_image_url,
		});
	}

	async addBookToLibrary(id_library: string, book: BookAllInfos): Promise<void> {
        const statement = await this.db.prepareAsync(
            'INSERT INTO book (id_book, title, description, publisher, publication_date, page_number, language, cover_image_url) VALUES ($id_book, $title, $description, $publisher, $publication_date, $page_number, $language, $cover_image_url);' +
            'INSERT INTO library_book (id_library, id_book) VALUES ($id_library, $id_book);'
        );

        await statement.executeAsync({
            $id_library: id_library,

            $id_book: book.id_book,
            $title: book.title,
            $description: book.description,
            $publisher: book.publisher,
            $publication_date: book.publication_date,
            $page_number: book.page_number,
            $language: book.language,
            $cover_image_url: book.cover_image_url,
        });

		console.log("addBookToLibrary: success")
    }
}

export class APIBookRepository implements BookRepository {
	
	async getAll(): Promise<BookAllInfos[]> {
		return [];
	}

	async getAllFromLib(): Promise<BookAllInfos[]> {
		return [];
	}

	async get(id: string): Promise<BookAllInfos | null> {
		return null;
	}

	async add(book: BookAllInfos): Promise<void> {
		return;
	}
	
	async addBookToLibrary(id_library: string, book: BookAllInfos): Promise<void> {
		return;
	}
}
