import { ActionRepositoryProps } from "@/repositories/action";
import { actionRepositoryFactory } from "@/repositories/factories/action";
import { libraryRepositoryFactory } from "@/repositories/factories/library";
import { userRepositoryFactory } from "@/repositories/factories/user";
import { LibraryRepositoryProps } from "@/repositories/library";
import { UserRepositoryProps } from "@/repositories/user";
import { SessionRepositoryProps } from "@/repositories/session";
import { sessionRepositoryFactory } from "@/repositories/factories/session";
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
