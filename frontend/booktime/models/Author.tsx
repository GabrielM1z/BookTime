import { CreateDtoStrictId, UpdateDto } from "@/types/repositories";

export interface Author {
    id_author: string;
    name: string;
    description: string;
}

export interface CreateAuthorDto extends CreateDtoStrictId<Author> { }
export interface UpdateAuthorDto extends UpdateDto<Author, 'id_author'> { }
