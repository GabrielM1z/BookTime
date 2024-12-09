import api from '@/services/api';
import { Library } from '@/models/Library';
import { Api } from '@/services/api';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { syncDB } from '@/core/syncService';
import { useRepository } from '@/hooks/useRepository';

export interface LibraryRepositoryProps {
    getAll: () => Promise<Library[]>;
    add: (name: string, actionRepository: ActionRepository) => Promise<void>;
}

export class SQLiteLibraryRepository implements LibraryRepositoryProps {
    private db: SQLiteDatabase;

    constructor() {
        this.db = useSQLiteContext();
    }

    async getAll(): Promise<Library[]> {
        let allRows = await this.db.getAllAsync<Library>(
            'SELECT * FROM library'
        );
        return allRows;
    }

    async add(name: string, actionRepository: ActionRepository): Promise<void> {
        const statement = await this.db.prepareAsync(
            'INSERT INTO library (name) VALUES ($name);'
        );

        syncDB(actionRepository)
        console.log("oui")
        


        await statement.executeAsync({
            $name: name
        });
    }
}

export class APILibraryRepository implements LibraryRepositoryProps {
    async getAll(): Promise<Library[]> {
        return [];
    }

    async add(name: string): Promise<void> {
        return;
    }
}
