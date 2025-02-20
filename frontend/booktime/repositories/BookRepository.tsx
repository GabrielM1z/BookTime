import { SQLiteDatabase } from 'expo-sqlite';
import { useSQLite } from "@/hooks/useSQLite";
import { Synchronisable } from './synchronisable';
import { BookAllInfos, BookInfosServeur, BookMinInfos } from '@/models/Book';

import api from "@/services/axios"
import { baseURL } from '@/constants/Api';
import { linkToBase64 } from '@/helpers/image';


export interface BookRepository {
	getAll: () => Promise<BookAllInfos[]>;
	getAllMin: () => Promise<BookMinInfos[]>;
	getAllFromLib: (id_lib: string) => Promise<BookAllInfos[]>
	get: (id: string) => Promise<BookAllInfos>;
	add: (state: BookAllInfos) => Promise<void>;
	addBookToLibrary: (id_library: string, book: BookAllInfos) => Promise<void>
	delBookFromLibrary: (id_library: string, id_book: string) => Promise<void>
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

	async getAllMin(): Promise<BookMinInfos[]> {
		let allRows = await this.db.getAllAsync<BookMinInfos>(
			'SELECT id_book, title, cover_image_url FROM book'
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

	async get(id: string): Promise<BookAllInfos> {
		const result = await this.db.getFirstAsync<BookAllInfos>(
			'SELECT * FROM book WHERE id_book == $id',
			{ $id: id }
		);

		if (result == null) {
			throw new Error("yeay"); //A custom celon la pagge erreur.
		}

		let bookCover = await linkToBase64(result.cover_image_url);
		result.cover_image_url = bookCover;


		return result;
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

	async delete(id: string): Promise<void> {
		await this.db.withTransactionAsync(async () => {
			const deleteBookStmt = await this.db.prepareAsync(
				'DELETE FROM book WHERE id_book == $id;'
			);

			await deleteBookStmt.executeAsync({
				$id: id
			});
		});
	}

	async addBookToLibrary(id_library: string, book: BookAllInfos): Promise<void> {

		try {
			await this.db.withExclusiveTransactionAsync(async () => {
				
				const insertBookStmt = await this.db.prepareAsync(
					`INSERT OR IGNORE INTO book (id_book, title, description, publisher, publication_date, page_number, language, cover_image_url) 
					VALUES ($id_book, $title, $description, $publisher, $publication_date, $page_number, $language, $cover_image_url);`
				);
	
				let resultInsertBook = await insertBookStmt.executeAsync({
					$id_book: book.id_book,
					$title: book.title,
					$description: book.description,
					$publisher: book.publisher,
					$publication_date: book.publication_date,
					$page_number: book.page_number,
					$language: book.language,
					$cover_image_url: book.cover_image_url,
				});
	
	
				const insertLibraryBookStmt = await this.db.prepareAsync(
					' INSERT OR IGNORE INTO library_book (id_library, id_book) VALUES ($id_library, $id_book);'
				);
	
				let resultInsertLibraryBook = await insertLibraryBookStmt.executeAsync({
					$id_library: id_library,
					$id_book: book.id_book,
				});
			});

			console.log("addBookToLibrary: success")

		} catch (error) {
			console.log("Failed addBookToLibrary :", error)
		}
	}

	async delBookFromLibrary(id_library: string, id_book: string): Promise<void> {
		await this.db.withTransactionAsync(async () => {
			const deleteLibraryBookStmt = await this.db.prepareAsync(
				'DELETE FROM library_book WHERE id_library == $id_library AND id_book == $id_book;'
			);

			await deleteLibraryBookStmt.executeAsync({
				$id_library: id_library,
				$id_book: id_book,
			});
		});
	}
}

export class APIBookRepository implements BookRepository {

	async getAll(): Promise<BookAllInfos[]> {
		return [];
	}

	async getAllFromLib(): Promise<BookAllInfos[]> {
		return [];
	}

	async get(id: string): Promise<BookAllInfos> {
		let bookData = await api.get(baseURL + `/books/books/` + id)

		if (bookData == null) {
			throw new Error("yeay"); //A custom celon la pagge erreur.
		}
		let imageBase64 = await linkToBase64(bookData.data.data.cover_image_url)
		const book: BookAllInfos = {
			id_book: bookData.data.data.id_book,
			title: bookData.data.data.title,
			description: bookData.data.data.description,
			publisher: bookData.data.data.publisher,
			publication_date: bookData.data.data.publication_date,
			page_number: bookData.data.data.page_number,
			language: bookData.data.data.language,
			cover_image_url: imageBase64,
		};

		return book;
	}

	async add(book: BookAllInfos): Promise<void> {
		return;
	}

	async delete(id: string): Promise<void> {
		return;
	}

	async addBookToLibrary(id_library: string, book: BookAllInfos): Promise<void> {
		return;
	}

	async delBookFromLibrary(id_library: string, id_book: string): Promise<void> {
		return;
	}

	async getAllMin(): Promise<BookMinInfos[]> {
		return [];
	}
}
