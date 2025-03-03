import { CreateDtoAutoId, UpdateDto } from "@/types/repositories";
import { Book, BookMinInfos } from "./Book";

export interface Library {
	id_library: string;
	name: string;
}

export interface CreateLibraryDto extends CreateDtoAutoId<Library, "id_library"> { }
export interface UpdateLibraryDto extends UpdateDto<Library, "id_library"> { }

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