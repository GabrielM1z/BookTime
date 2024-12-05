import { AuthResponseProps, PayloadProps } from '@/models/keycloak';
import { User } from '@/models/user';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { jwtDecode } from 'jwt-decode';

export interface UserRepositoryProps {
    getUserFromKeycloakToken(data: AuthResponseProps): User;
    getUserById(id: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    addUser(user: User): Promise<void>;
    updateUser(user: User): Promise<void>;
    deleteUser(user: User): Promise<void>;
}

class CommonUserRepository {
    getUserFromKeycloakToken(data: AuthResponseProps): User {
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

    async getUserById(id: string): Promise<User | null> {
        const statement = await this.db.prepareAsync(`
            SELECT * FROM user WHERE id = $id;
        `);

        let result = await statement.executeAsync<User>({
            $id: id
        });

        return result.getFirstAsync();
    }

    async getAllUsers(): Promise<User[]> {
        let result = await this.db.getAllAsync<User>(`
            SELECT * FROM user;
        `);
        return result;
    }

    async addUser(user: User): Promise<void> {
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

    async updateUser(user: User): Promise<void> {
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

    async deleteUser(user: User): Promise<void> {
        const statement = await this.db.prepareAsync(`
            DELETE FROM user WHERE id = $id;
        `);

        await statement.executeAsync({
            $id: user.id
        });
    }
}


export class APIUserRepository extends CommonUserRepository implements UserRepositoryProps {
    async getUserById(id: string): Promise<User | null> {
        const response = await fetch(`/api/user/${id}`);
        if (response.ok) {
            return await response.json();
        } else {
            return null;
        }
    }

    async getAllUsers(): Promise<User[]> {
        const response = await fetch('/api/user');
        return await response.json();
    }

    async addUser(user: User): Promise<void> {
        await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    }

    async updateUser(user: User): Promise<void> {
        await fetch(`/api/user/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    }

    async deleteUser(user: User): Promise<void> {
        await fetch(`/api/user/${user.id}`, {
            method: 'DELETE'
        });
    }
}
