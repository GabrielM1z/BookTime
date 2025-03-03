import { CreateDtoStrictId, UpdateDto } from "@/types/repositories";

export interface Genre {
    id_genre: string;
    name: string;
}

export interface CreateGenreDto extends CreateDtoStrictId<Genre> { }
export interface UpdateGenreDto extends UpdateDto<Genre, "id_genre"> { }
