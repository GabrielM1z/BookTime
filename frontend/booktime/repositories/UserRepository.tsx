import api from '@/services/axios';
import { User, UpdateUserDto } from '@/models/User';
import { SQLiteDatabase } from 'expo-sqlite';
import { Synchronisable } from './synchronisable';
import { useSQLite } from '@/hooks/useSQLite';

export interface UserRepository {
    get(id: string): Promise<User | null>;
    getAll(): Promise<User[]>;
    add(user: User): Promise<void>;
    update(user: User): Promise<void>;
    delete(user: User): Promise<void>;
}

export class SQLiteUserRepository extends Synchronisable implements UserRepository {
    private db: SQLiteDatabase;

    constructor() {
        super();
        this.db = useSQLite().db;
    }

    async get(id: string): Promise<User | null> {
        const statement = await this.db.prepareAsync(`
            SELECT * FROM user WHERE id_user = $id_user;
        `);

        let result = await statement.executeAsync<User>({
            $id_user: id
        });

        return result.getFirstAsync();
    }

    async getAll(): Promise<User[]> {
        let result = await this.db.getAllAsync<User>(`
            SELECT * FROM user;
        `);
        return result;
    }

    async add(user: User): Promise<void> {
        const statement = await this.db.prepareAsync(`
            INSERT INTO user (id_user, email, name, pseudo, description, private, profil_image, banner_image, birthdate)
            VALUES (
                $id_user,
                $email,
                $name,
                $pseudo,
                $description,
                $private,
                $profil_image,
                $banner_image,
                $birthdate
            );
        `);

        await statement.executeAsync({
            $id_user: user.id_user,
            $email: user.email,
            $name: user.name,
            $pseudo: user.pseudo,
            $description: user.description,
            $private: user.private,
            $profil_image: user.profil_image,
            $banner_image: user.banner_image,
            $birthdate: user.birthdate
        });
    }

    async update(user: UpdateUserDto): Promise<void> {
        const statement = await this.db.prepareAsync(`
            UPDATE user
            SET pseudo = $pseudo,
                description = $description,
                private = $private,
                profil_image = $profil_image,
                banner_image = $banner_image,
                birthdate = $birthdate
            WHERE id_user = $id_user;
        `);

        await statement.executeAsync({
            $id_user: user.id_user,
            $pseudo: user.pseudo,
            $description: user.description,
            $private: user.private,
            $profil_image: user.profil_image,
            $banner_image: user.banner_image,
            $birthdate: user.birthdate
        });
    }

    async delete(id_or_user: string | User): Promise<void> {
        const id = typeof id_or_user === 'string' ? id_or_user : id_or_user.id_user;

        const statement = await this.db.prepareAsync(`
            DELETE FROM user WHERE id_user = $id_user;
        `);

        await statement.executeAsync({
            $id_user: id,
        });
    }
}


export class APIUserRepository implements UserRepository {
    async getFromToken(): Promise<User> {
        const response = await api.get('/api/users/userfromtoken');
        // FIXME: weird response structure
        return response["data"]["data"]["user"];
    }

    async get(id: string): Promise<User | null> {
        console.log("APIUserRepository.get");
        const response = await api.get(`/api/users/user/${id}`);
        const { data } = response;
        console.log(data);
        return data;
    }

    async getAll(): Promise<User[]> {
        const response = await api.get('/api/user');
        return response.data;
    }

    async add(user: User): Promise<void> {
        await api.post('/api/user', user);
    }

    async update(user: User): Promise<void> {
        await api.put(`/api/user/${user.id_user}`, user);
    }

    async delete(user: User): Promise<void> {
        await api.delete(`/api/user/${user.id_user}`);
    }
}
