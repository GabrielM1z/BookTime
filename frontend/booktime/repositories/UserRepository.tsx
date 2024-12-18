import api from '@/services/api';
import { AuthResponseProps, PayloadProps } from '@/models/keycloak';
import { User } from '@/models/User';
import { Session } from '@/models/Session';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { Synchronisable } from './synchronisable';

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
        this.db = useSQLiteContext();
        this.api = new APIUserRepository();
    }

    async getBySession(session: Session): Promise<User> {
        let user = await this.getById(session.idUser);
        if (!user) {
            user = await this.api.getBySession(session);
            this.add(user);
        }
        return user;
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


export class APIUserRepository implements UserRepository {
    async getBySession(session: Session): Promise<User> {
        // if (!session.isGuest) {
        //     return User.
        // }
        if (!session.accessToken) {
            throw new Error('No access token in session');
        }

        const tokenUser = User.fromToken(session.accessToken);
        const apiUser = await this.getById(tokenUser.id);
        const user = new User({...tokenUser, ...apiUser});
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
        await api.put(`/api/user/${user.id}`, user);
    }

    async delete(user: User): Promise<void> {
        await api.delete(`/api/user/${user.id}`);
    }
}
