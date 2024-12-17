import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Synchronisable } from './synchronisable';
import { v4 as uuidv4 } from 'uuid';
import { Book, BookAllInfos } from '@/models/Book';


export interface BookRepositoryProps {
	getAll: () => Promise<BookAllInfos[]>;
	get: (id: string) => Promise<BookAllInfos | null>;
	add: (state: BookAllInfos) => Promise<void>;
}

export class SQLiteBookRepository extends Synchronisable implements BookRepositoryProps {
	private db: SQLiteDatabase;
	private api: APIBookRepository;

	constructor() {
		super();
		this.db = useSQLiteContext();
		this.api = new APIBookRepository();
	}

	async getAll(): Promise<BookAllInfos[]> {
		let allRows = await this.db.getAllAsync<BookAllInfos>(
			'SELECT * FROM book'
		);
		return allRows;
	}

	async get(id: string): Promise<BookAllInfos | null> {
		const statement = await this.db.prepareAsync(
			'SELECT * FROM book WHERE id_book == $id'
		);

		const result = await statement.executeAsync({
			$id: id
		});

		return result ? (result as unknown as BookAllInfos) : null;
	}
	
	async add(book: BookAllInfos): Promise<void> {
		const statement = await this.db.prepareAsync(
			'INSERT INTO book (id_book, title, description, id_format, publisher, publication_date, page_number, language, cover_image_url) VALUES ($id_book, $title, $description, $id_format, $publisher, $publication_date, $page_number, $language, $cover_image_url);'
		);

		await statement.executeAsync({
			$id_book: book.id_book,
			$title: book.title,
			$description: book.description,
			$id_format: book.id_format,
			$publisher: book.publisher,
			$publication_date: book.publication_date,
			$page_number: book.page_number,
			$language: book.language,
			$cover_image_url: book.cover_image_url,
		});
	}
}

export class APIBookRepository implements BookRepositoryProps {
	
	async getAll(): Promise<BookAllInfos[]> {
		return [];
	}

	async get(id: string): Promise<BookAllInfos | null> {
		return null;
	}

	async add(book: BookAllInfos): Promise<void> {
		return;
	}

}
