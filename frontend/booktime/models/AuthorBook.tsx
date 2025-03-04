import { CreateDtoStrictId, DeleteDtoJunction } from "@/types/repositories";

export interface AuthorBook {
    id_author: string;
    id_book: string;
}

export interface CreateAuthorBookDto extends CreateDtoStrictId<AuthorBook> { }
export interface DeleteAuthorBookDto extends DeleteDtoJunction<AuthorBook, ["id_author", "id_book"]> { }
