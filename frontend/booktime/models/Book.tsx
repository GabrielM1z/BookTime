import { CreateDtoStrictId, UpdateDto } from "@/types/repositories";
import { Author } from "./Author";

// export interface BookInfos{
//     title : string;
//     authors? : string[];
//     imageLinks? : {thumbnail : string};
// }

export interface BookInfos {
	id: string;
	title: string
	description: string;
	isbn13: string;
	format: string;
	publisher: string;
	publicationDate: string;
	pageNumber: number;
	language: string;
	thumbnail: string;
	authors?: string[];
	genres?: string[];
}

export interface BookSearchResult {
	id: string;
	title: string
	isbn13: string;
	thumbnail: string;
	authors?: string[];
}

//book model BDD
export interface Book {
	id_book: string;
	title: string;
	description: string;
	publisher: string;
	publication_date: string;
	page_number: number;
	language: string;
	cover_image_url: string;
}

export interface CreateBookDto extends CreateDtoStrictId<Book> { }
export interface UpdateBookDto extends UpdateDto<Book, "id_book"> { }

export interface BookMinInfos {
	id_book: string;
	title: string;
	cover_image_url: string;
}

export interface BookInfosServeur {
	id_book: string;
	title: string;
	description: string;
	publisher: string;
	publication_date: string;
	page_number: number;
	language: string;
	cover_image_url: string;
	authors: Author[];
	genres: string[];
}
