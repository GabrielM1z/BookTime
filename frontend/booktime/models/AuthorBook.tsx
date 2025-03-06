import { CreateDtoStrictId, DeleteDto, UpdateDto } from "@/types/repositories";

export interface AuthorBook {
    id_author: string;
    id_book: string;
}

export interface CreateAuthorBookDto extends CreateDtoStrictId<AuthorBook> { }
export interface UpdateAuthorBookDto extends UpdateDto<AuthorBook, ["id_author", "id_book"]> { }
export interface DeleteAuthorBookDto extends DeleteDto<AuthorBook, ["id_author", "id_book"]> { }
