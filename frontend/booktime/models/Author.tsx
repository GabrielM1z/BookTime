import { CreateDtoStrictId, DeleteDto, UpdateDto } from "@/types/repositories";

export interface Author {
    id_author: string;
    name: string;
    description: string;
}

export interface CreateAuthorDto extends CreateDtoStrictId<Author> { }
export interface UpdateAuthorDto extends UpdateDto<Author, ['id_author']> { }
export interface DeleteAuthorDto extends DeleteDto<Author, ['id_author']> { }
