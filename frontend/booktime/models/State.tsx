import { CreateDtoStrictId, DeleteDto, UpdateDto } from "@/types/repositories";

export interface State {
    state: string;
    progression: number;
    readcount: number;
    last_read_date: string
    id_user: string;
    id_book: string;
    is_available: boolean;
    comment: string;
    rate: number;
}

export interface CreateStateDto extends CreateDtoStrictId<State> { }
export interface UpdateStateDto extends UpdateDto<State, ["id_user", "id_book"]> { }
export interface DeleteStateDto extends DeleteDto<State, ["id_user", "id_book"]> { }
