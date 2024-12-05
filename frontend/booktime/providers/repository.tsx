import { userRepositoryFactory } from "@/repositories/factories/user";
import { UserRepositoryProps } from "@/repositories/user";
import { SQLiteProvider, SQLiteProviderProps } from "expo-sqlite";
import React, { createContext, useContext } from "react";

export interface RepositoryContextProps {
    userRepository: UserRepositoryProps;
}

const RepositoryContext = createContext<RepositoryContextProps | undefined>(undefined);

export function useRepository() {
    const context = useContext(RepositoryContext);
    if (!context) {
        throw new Error("useRepository must be used within a RepositoryProviderWrapper");
    }
    return context;
}

function RepositoryProvider({ children }: { children: React.ReactNode }) {
    let userRepository = userRepositoryFactory();

    return (
        <RepositoryContext.Provider value={{ userRepository }}>
            {children}
        </RepositoryContext.Provider>
    );
}

export function RepositoryProviderWrapper({
    children,
    onError,
    useSuspense = false,
    ...props
}: SQLiteProviderProps) {
    return (
        <SQLiteProvider {...props}>
            <RepositoryProvider>{children}</RepositoryProvider>
        </SQLiteProvider>
    );
}
