import api from '@/services/api';
import { AuthResponseProps, PayloadProps } from '@/models/keycloak';
import { User } from '@/models/User';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { jwtDecode } from 'jwt-decode';
import { Synchronisable } from './synchronisable';

export interface UserRepositoryProps {
    getFromKeycloakToken(data: AuthResponseProps): User;
    getById(id: string): Promise<User | null>;
    getAll(): Promise<User[]>;
    add(user: User): Promise<void>;
    update(user: User): Promise<void>;
    delete(user: User): Promise<void>;
}

export class SQLiteUserRepository extends Synchronisable implements UserRepositoryProps {
    private db: SQLiteDatabase;
    private api: APIUserRepository;

    constructor() {
        super();
        this.db = useSQLiteContext();
        this.api = new APIUserRepository();
    }

    getFromKeycloakToken(data: AuthResponseProps): User {
        return this.api.getFromKeycloakToken(data);
    }

    async getById(id: string): Promise<User | null> {
        const statement = await this.db.prepareAsync(`
            SELECT * FROM user WHERE id = $id;
        `);

        let result = await statement.executeAsync<User>({
            $id: id
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
            INSERT INTO user (id, username, email, email_verified, given_name, family_name)
            VALUES (
                $id,
                $username,
                $email,
                $email_verified,
                $given_name,
                $family_name
            );
        `);

        await statement.executeAsync({
            $id: user.id,
            $username: user.username,
            $email: user.email,
            $email_verified: user.emailVerified,
            $given_name: user.givenName,
            $family_name: user.familyName
        });
    }

    async update(user: User): Promise<void> {
        const statement = await this.db.prepareAsync(`
            UPDATE user
            SET username = $username,
                email = $email,
                email_verified = $email_verified,
                given_name = $given_name,
                family_name = $family_name
            WHERE id = $id;
        `);

        await statement.executeAsync({
            $id: user.id,
            $username: user.username,
            $email: user.email,
            $email_verified: user.emailVerified,
            $given_name: user.givenName,
            $family_name: user.familyName
        });
    }

    async delete(user: User): Promise<void> {
        const statement = await this.db.prepareAsync(`
            DELETE FROM user WHERE id = $id;
        `);

        await statement.executeAsync({
            $id: user.id
        });
    }
}


export class APIUserRepository implements UserRepositoryProps {
    getFromKeycloakToken(data: AuthResponseProps): User {
        const payload = jwtDecode<PayloadProps>(data.access_token);

        // call api pour avoir le reste des info

        return new User({
            id: payload.sub,
            emailVerified: payload.email_verified,
            username: payload.preferred_username,
            givenName: payload.given_name,
            familyName: payload.family_name,
            email: payload.email
        });
    }

    async getById(id: string): Promise<User | null> {
        const response = await api.get(`/api/user/${id}`);
        return response.data;
    }

    async getAll(): Promise<User[]> {
        const response = await api.get('/api/user');
        return response.data;
    }

    async add(user: User): Promise<void> {
        await api.post('/api/user', user);
    }

    async update(user: User): Promise<void> {
        await api.put(`/api/user/${user.id}`, user);
    }

    async delete(user: User): Promise<void> {
        await api.delete(`/api/user/${user.id}`);
    }
}
