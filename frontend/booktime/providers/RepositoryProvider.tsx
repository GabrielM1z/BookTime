import { ActionRepositoryProps } from "@/repositories/ActionRepository";
import { actionRepositoryFactory } from "@/repositories/factories/actionRepositoryFactory";
import { libraryRepositoryFactory } from "@/repositories/factories/libraryRepositoryFactory";
import { userRepositoryFactory } from "@/repositories/factories/userRepositoryFactory";
import { LibraryRepositoryProps } from "@/repositories/LibraryRepository";
import { UserRepositoryProps } from "@/repositories/UserRepository";
import { SessionRepositoryProps } from "@/repositories/session";
import { sessionRepositoryFactory } from "@/repositories/factories/sessionRepositoryFactory";
import { SQLiteProvider, SQLiteProviderProps } from "expo-sqlite";
import React, { createContext } from "react";

export interface RepositoryContextProps {
    userRepository: UserRepositoryProps;
    libraryRepository: LibraryRepositoryProps;
    actionRepository: ActionRepositoryProps;
    sessionRepository: SessionRepositoryProps;
}

export const RepositoryContext = createContext<RepositoryContextProps | undefined>(undefined);

function RepositoryProvider({ children }: { children: React.ReactNode }) {
    const userRepository = userRepositoryFactory();
    const libraryRepository = libraryRepositoryFactory();
    const actionRepository = actionRepositoryFactory();
    const sessionRepository = sessionRepositoryFactory();

    return (
        <RepositoryContext.Provider value={{
            userRepository,
            libraryRepository,
            actionRepository,
            sessionRepository,
        }}>
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
