import { libraryRepositoryFactory } from "@/repositories/factories/library";
import { userRepositoryFactory } from "@/repositories/factories/user";
import { LibraryRepositoryProps } from "@/repositories/library";
import { UserRepositoryProps } from "@/repositories/user";
import { SQLiteProvider, SQLiteProviderProps } from "expo-sqlite";
import React, { createContext } from "react";
import { ApiProvider } from "./api";
import { actionRepositoryFactory } from "@/repositories/factories/action";
import { ActionRepositoryProps } from "@/repositories/action";

export interface RepositoryContextProps {
    userRepository: UserRepositoryProps;
    libraryRepository: LibraryRepositoryProps;
    actionRepository: ActionRepositoryProps;
}

export const RepositoryContext = createContext<RepositoryContextProps | undefined>(undefined);

function RepositoryProvider({ children }: { children: React.ReactNode }) {
    const userRepository = userRepositoryFactory();
    const libraryRepository = libraryRepositoryFactory();
    const actionRepository = actionRepositoryFactory();

    return (
        <RepositoryContext.Provider value={{
            userRepository,
            libraryRepository,
            actionRepository,
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
            <ApiProvider>
                <RepositoryProvider>{children}</RepositoryProvider>
            </ApiProvider>
        </SQLiteProvider>
    );
}
