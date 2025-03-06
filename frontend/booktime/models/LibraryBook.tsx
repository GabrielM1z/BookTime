import { CreateDtoStrictId, DeleteDto, UpdateDto } from "@/types/repositories";

export interface LibraryBook {
    id_library: string;
    id_book: string;
}

export interface CreateLibraryBookDto extends CreateDtoStrictId<LibraryBook> { }
export interface UpdateLibraryBookDto extends UpdateDto<LibraryBook, ["id_library", "id_book"]> { }
export interface DeleteLibraryBookDto extends DeleteDto<LibraryBook, ["id_library", "id_book"]> { }
