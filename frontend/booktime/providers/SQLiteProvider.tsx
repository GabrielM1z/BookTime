import { wrapDbWithErrorHandler } from '@/db/wrapDBWithErrorHandler';
import { SQLiteDatabase, SQLiteProvider as SQLiteProviderOriginal, SQLiteProviderProps, useSQLiteContext } from 'expo-sqlite';
import React, { createContext } from 'react';

export type { SQLiteProviderProps } from 'expo-sqlite';

export const SQLiteContext = createContext<SQLiteDatabase | undefined>(undefined);

function SQLiteProviderInner({ children }: { children: React.ReactNode }) {
    const db = wrapDbWithErrorHandler(useSQLiteContext());

    return (
        <SQLiteContext.Provider value={db}>
            {children}
        </SQLiteContext.Provider>
    );
}

export function SQLiteProvider({ children, ...props }: SQLiteProviderProps) {
    return (
        <SQLiteProviderOriginal {...props}>
            <SQLiteProviderInner>
                {children}
            </SQLiteProviderInner>
        </SQLiteProviderOriginal>
    );
}
