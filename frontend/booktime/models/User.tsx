export interface UserProps {
    id_user: string;
}

export interface UpdateUserDto extends UserProps{
    pseudo?: string;
    description?: string;
    private?: boolean;
    profil_image?: string;
    banner_image?: string;
    birthdate?: string;
}

export interface User extends UserProps{
    name?: string;
    email?: string;
    pseudo?: string;
    description?: string;
    private?: boolean;
    profil_image?: string;
    banner_image?: string;
    birthdate?: string;
}
 