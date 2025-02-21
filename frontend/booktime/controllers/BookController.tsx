import { DualRepositoryController } from "./DualRepositoryController";
import { APIBookRepository, SQLiteBookRepository } from "@/repositories/BookRepository";
import { Library } from "@/models/Library";
import { BookAllInfos } from "@/models/Book";

export class BookController extends DualRepositoryController<SQLiteBookRepository, APIBookRepository> {
    constructor() {
        super(new APIBookRepository(), new SQLiteBookRepository());
    }

    async getAllFromLibrary(id_or_library: string | Library): Promise<BookAllInfos[]> {

    }
    
}