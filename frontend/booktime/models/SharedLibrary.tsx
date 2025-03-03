import { CreateDtoStrictId, DeleteDtoJunction, UpdateDto } from "@/types/repositories";

export interface SharedLibrary {
    id_library: string;
    id_user: string;
}

export interface CreateSharedLibraryDto extends CreateDtoStrictId<SharedLibrary> { }
export interface UpdateSharedLibraryDto extends UpdateDto<SharedLibrary, "id_library" | "id_user"> { }
export interface DeleteSharedLibraryDto extends DeleteDtoJunction<SharedLibrary, ["id_library", "id_user"]> { }
