import api from '@/services/api';
import { User } from '@/models/User';
import { Session } from '@/models/Session';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Synchronisable } from './synchronisable';
import { userFromToken, guestUserFactory } from '@/helpers/keycloak';
import { useSQLite } from '@/hooks/useSQLite';

export interface UserRepository {
    getBySession(session: Session): Promise<User>;
    getById(id: string): Promise<User | null>;
    getAll(): Promise<User[]>;
    update(user: User): Promise<void>;
    delete(user: User): Promise<void>;
}

export class SQLiteUserRepository extends Synchronisable implements UserRepository {
    private db: SQLiteDatabase;
    private api: APIUserRepository;

    constructor() {
        super();
        this.db = useSQLite().db;
        this.api = new APIUserRepository();
    }

    async getBySession(session: Session): Promise<User> {
        let user = await this.getById(session.id_user);
        if (!user) {
            user = session.isGuest() ? guestUserFactory() : await this.api.getBySession(session);
            await this.add(user);
        }
        return user;
    }

    async getById(id: string): Promise<User | null> {
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
            INSERT INTO user (id_user, username, email, email_verified, given_name, family_name)
            VALUES (
                $id_user,
                $username,
                $email,
                $email_verified,
                $given_name,
                $family_name
            );
        `);

        await statement.executeAsync({
            $id_user: user.id_user,
            $username: user.username,
            $email: user.email,
            $email_verified: user.email_verified,
            $given_name: user.given_name,
            $family_name: user.family_name
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
            WHERE id_user = $id_user;
        `);

        await statement.executeAsync({
            $id_user: user.id_user,
            $username: user.username,
            $email: user.email,
            $email_verified: user.email_verified,
            $given_name: user.given_name,
            $family_name: user.family_name
        });
    }

    async delete(user: User): Promise<void> {
        const statement = await this.db.prepareAsync(`
            DELETE FROM user WHERE id_user = $id_user;
        `);

        await statement.executeAsync({
            $id_user: user.id_user
        });
    }
}


export class APIUserRepository implements UserRepository {
    async getBySession(session: Session): Promise<User> {
        // if (!session.isGuest) {
        //     return User.
        // }
        if (!session.access_token) {
            throw new Error('No access token in session');
        }

        const tokenUser = userFromToken(session.access_token);
        const apiUser = await this.getById(tokenUser.id_user);
        const user = { ...tokenUser, ...apiUser };
        return user;
    }

    async getById(id: string): Promise<User | null> {
        const response = await api.get(`/api/user/${id}`);
        return response.data;
    }

    async getAll(): Promise<User[]> {
        const response = await api.get('/api/user');
        return response.data;
    }

    async update(user: User): Promise<void> {
        await api.put(`/api/user/${user.id_user}`, user);
    }

    async delete(user: User): Promise<void> {
        await api.delete(`/api/user/${user.id_user}`);
    }
}
