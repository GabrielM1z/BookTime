import { useApi } from '@/hooks/useApi';
import { AuthResponseProps, PayloadProps } from '@/models/keycloak';
import { User } from '@/models/user';
import { Api } from '@/services/api';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { jwtDecode } from 'jwt-decode';

export interface UserRepositoryProps {
    getFromKeycloakToken(data: AuthResponseProps): User;
    getById(id: string): Promise<User | null>;
    getAll(): Promise<User[]>;
    add(user: User): Promise<void>;
    update(user: User): Promise<void>;
    delete(user: User): Promise<void>;
}

class CommonUserRepository {
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
}

export class SQLiteUserRepository extends CommonUserRepository implements UserRepositoryProps {
    private db: SQLiteDatabase;

    constructor() {
        super();
        this.db = useSQLiteContext();
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


export class APIUserRepository extends CommonUserRepository implements UserRepositoryProps {
    private api: Api;

    constructor() {
        super();
        this.api = useApi();
    }

    async getById(id: string): Promise<User | null> {
        const response = await this.api.get(`/api/user/${id}`);
        return response.data;
    }

    async getAll(): Promise<User[]> {
        const response = await this.api.get('/api/user');
        return response.data;
    }

    async add(user: User): Promise<void> {
        await this.api.post('/api/user', user);
    }

    async update(user: User): Promise<void> {
        await this.api.put(`/api/user/${user.id}`, user);
    }

    async delete(user: User): Promise<void> {
        await this.api.delete(`/api/user/${user.id}`);
    }
}
