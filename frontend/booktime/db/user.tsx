import { SQLiteDatabase } from 'expo-sqlite';
import { User } from '@/models/user';

export const addUser = async (db: SQLiteDatabase, user: User) => {
    const statement = await db.prepareAsync(`
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

    try {
        let result = await statement.executeAsync({
            $id: user.id,
            $username: user.username,
            $email: user.email,
            $email_verified: user.emailVerified,
            $given_name: user.givenName,
            $family_name: user.familyName
        });
        console.log('result : ', result);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error insert into User', error);
    }
}

export const getUsers = async (db: SQLiteDatabase) : Promise<User[]> => {
    const statement = await db.prepareAsync(`
        SELECT * FROM user;
    `);
    try {
        let result = await statement.executeAsync<User>();
        return result.getAllAsync();

    } catch (error) {
        console.error('Error select from User', error);
        return [];
    }
}

export const deleteUser = async (db: SQLiteDatabase, user: User) => {
    const statement = await db.prepareAsync(`
        DELETE FROM user WHERE uuid = $uuid;
    `);

    try {
        let result = await statement.executeAsync({
            $uuid: user.id
        });
        console.log('result : ', result);
    } catch (error) {
        console.error('Error delete from User', error);
    }
}
