import { CreateDtoStrictId, DeleteDtoJunction, UpdateDto } from "@/types/repositories";

export interface State {
    state: string;
    progression: number;
    read_count: number;
    last_read_date: string
    id_user: string;
    id_book: string;
    is_available: boolean;
}

export interface CreateStateDto extends CreateDtoStrictId<State> { }
export interface UpdateStateDto extends UpdateDto<State, "id_user" | "id_book"> { }
export interface DeleteStateDto extends DeleteDtoJunction<State, ["id_user", "id_book"]> { }
