import { BookAllInfos } from "./Book";
import { Book2 } from "./Book2";

export interface Library {
	id: string;
	name: string;
}

export interface LibraryWithBooks {
	id: string;
	name: string;
	books: BookAllInfos[]
}