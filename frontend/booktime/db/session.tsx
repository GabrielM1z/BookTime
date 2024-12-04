import { SQLiteDatabase } from 'expo-sqlite';
import { Session } from '@/models/session';

export const addSession = async (db: SQLiteDatabase, session: Session) => {
    const statement = await db.prepareAsync(`
        INSERT INTO session (id_session, id_user, is_guest, access_token, expires_in, refresh_token, refresh_expires_in, token_type, session_state)
        VALUES (
            $id_session,
            $id_user,
            $is_guest,
            $access_token,
            $expires_in,
            $refresh_token,
            $refresh_expires_in,
            $token_type,
            $session_state
        );
    `);

    let result = await statement.executeAsync({
        $id_session: session.id,
        $id_user: session.user?.id,
        $is_guest: session.isGuest,
        $access_token: session.accessToken,
        $expires_in: session.expiresIn,
        $refresh_token: session.refreshToken,
        $refresh_expires_in: session.refreshExpiresIn,
        $token_type: session.tokenType,
        $session_state: session.sessionState,
    });
}

export const getSessions = async (db: SQLiteDatabase): Promise<Session[]> => {
    const statement = await db.prepareAsync(`
        SELECT * FROM session LEFT JOIN user ON session.id_user = user.id_user;
    `);
    try {
        let result = await statement.executeAsync<Session>();
        return result.getAllAsync();

    } catch (error) {
        console.error('Error select from Session', error);
        return [];
    }
}

export const getSession = async (db: SQLiteDatabase, id: string): Promise<Session | null> => {
    const statement = await db.prepareAsync(`
        SELECT * FROM session WHERE id = $id LEFT JOIN user ON session.id_user = user.id_user;
    `);
    try {
        let result = await statement.executeAsync<Session>({
            $id: id
        });
        return result.getFirstAsync();

    } catch (error) {
        console.error('Error select from Session', error);
        return null;
    }
}

export const deleteSession = async (db: SQLiteDatabase, session: Session) => {
    const statement = await db.prepareAsync(`
        DELETE FROM session WHERE id = $id;
    `);

    try {
        let result = await statement.executeAsync({
            $uuid: session.id,
        });
        console.log('result : ', result);
    } catch (error) {
        console.error('Error delete from Session', error);
    }
}
