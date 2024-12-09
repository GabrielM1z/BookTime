import { SQLiteContext, SQLiteContextProps } from '@/providers/SQLiteProvider';
import { useContext } from 'react';

export function useSQLite(): SQLiteContextProps {
    const context = useContext(SQLiteContext);
    if (!context) {
        throw new Error('useSQLiteContext must be used within a SQLiteProvider');
    }
    return context;
}
