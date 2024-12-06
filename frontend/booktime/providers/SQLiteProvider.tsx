import { usePersistentState } from '@/hooks/usePersistantState';
import { SQLiteDatabase, SQLiteProvider as SQLiteProviderOriginal, SQLiteProviderProps, useSQLiteContext } from 'expo-sqlite';
import React, { createContext } from 'react';

export interface SQLiteContextProps {
    db: SQLiteDatabase;
    lastSync: string | null;
    setLastSync: (lastSync: string | null) => void;
}

export const SQLiteContext = createContext<SQLiteContextProps | undefined>(undefined);

export function SQLProvider({ children, ...props }: SQLiteProviderProps) {
    const [lastSync, setLastSync] = usePersistentState<string | null>('lastSync', null);
    const db = useSQLiteContext();

    return (
        <SQLiteProviderOriginal {...props}>
            <SQLiteContext.Provider value={{ db, lastSync, setLastSync }}>
                {children}
            </SQLiteContext.Provider>
        </SQLiteProviderOriginal>
    );
}
