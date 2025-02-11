import { BookAllInfos, BookMinInfos } from "./Book";
import { Book2 } from "./Book2";

export interface Library {
	id_library: string;
	name: string;
}

export interface LibraryWithBooks {
	id_library: string;
	name: string;
	books: BookAllInfos[]
}

export interface LibraryWithBooksMin extends Library {
	id_library: string;
	name: string;
	books: BookMinInfos[]
}