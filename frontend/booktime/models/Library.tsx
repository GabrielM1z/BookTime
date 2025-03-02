import { Book, BookMinInfos } from "./Book";
import { Book2 } from "./Book2";

export interface Library {
	id_library: string;
	name: string;
}

export interface CreateLibraryDto extends Omit<Library, "id_library"> { }

export interface LibraryWithBooks {
	id_library: string;
	name: string;
	books: Book[]
}

export interface LibraryWithBooksMin {
	id_library: string;
	name: string;
	books: BookMinInfos[]
}