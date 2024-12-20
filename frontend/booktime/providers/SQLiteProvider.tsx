import { usePersistentState } from '@/hooks/usePersistantState';
import { SQLiteDatabase, SQLiteProvider as SQLiteProviderOriginal, SQLiteProviderProps, useSQLiteContext } from 'expo-sqlite';
import React, { createContext } from 'react';
import { wrapDbWithErrorHandler } from '@/db/wrapDBWithErrorHandler'

export interface SQLiteContextProps {
    db: SQLiteDatabase;
    lastSync: string | null;
    setLastSync: (lastSync: string | null) => void;
}

export const SQLiteContext = createContext<SQLiteContextProps | undefined>(undefined);

export function SQLiteProviderInner({ children }: { children: React.ReactNode }) {
    const [lastSync, setLastSync] = usePersistentState<string | null>('lastSync', null);
    const db = wrapDbWithErrorHandler(useSQLiteContext());

    return (
        
            <SQLiteContext.Provider value={{ db, lastSync, setLastSync }}>
                {children}
            </SQLiteContext.Provider>
    );
}

export function SQLiteProvider({ children, ...props }: SQLiteProviderProps) {
    return (
        <SQLiteProviderOriginal {...props}>
            <SQLiteProviderInner {...props}>
                {children}
            </SQLiteProviderInner>
        </SQLiteProviderOriginal>
    );
}
