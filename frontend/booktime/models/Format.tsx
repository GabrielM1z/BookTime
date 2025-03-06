import { CreateDtoStrictId, DeleteDto, UpdateDto } from "@/types/repositories";

export interface Format {
    id_format: string;
    name: string;
}

export interface CreateFormatDto extends CreateDtoStrictId<Format> { }
export interface UpdateFormatDto extends UpdateDto<Format, ['id_format']> { }
export interface DeleteFormatDto extends DeleteDto<Format, ['id_format']> { }
