import { ActionRepository } from "@/repositories/ActionRepository";
import { AuthorRepository } from "@/repositories/AuthorRepository";
import { FormatRepository } from "@/repositories/FormatRepository";
import { GenreRepository } from "@/repositories/GenreRepository";
import { LibraryRepository } from "@/repositories/LibraryRepository";
import { SessionRepository } from "@/repositories/SessionRepository";
import { UserRepository } from "@/repositories/UserRepository";
import { actionRepositoryFactory } from "@/repositories/factories/actionRepositoryFactory";
import { authorRepositoryFactory } from "@/repositories/factories/authorRepositoryFactory";
import { formatRepositoryFactory } from "@/repositories/factories/formatRepositoryFactory";
import { genreRepositoryFactory } from "@/repositories/factories/genreRepositoryFactory";
import { libraryRepositoryFactory } from "@/repositories/factories/libraryRepositoryFactory";
import { sessionRepositoryFactory } from "@/repositories/factories/sessionRepositoryFactory";
import { userRepositoryFactory } from "@/repositories/factories/userRepositoryFactory";
import { SQLiteProvider, SQLiteProviderProps } from "expo-sqlite";
import React, { createContext } from "react";


export interface RepositoryContextProps {
    userRepository: UserRepository;
    libraryRepository: LibraryRepository;
    actionRepository: ActionRepository;
    sessionRepository: SessionRepository;
    formatRepository: FormatRepository;
    genreRepository: GenreRepository;
    authorRepository: AuthorRepository;
}

export const RepositoryContext = createContext<RepositoryContextProps | undefined>(undefined);

function RepositoryProvider({ children }: { children: React.ReactNode }) {
    const userRepository = userRepositoryFactory();
    const libraryRepository = libraryRepositoryFactory();
    const actionRepository = actionRepositoryFactory();
    const sessionRepository = sessionRepositoryFactory();
    const formatRepository = formatRepositoryFactory();
    const genreRepository = genreRepositoryFactory();
    const authorRepository = authorRepositoryFactory();

    return (
        <RepositoryContext.Provider value={{
            userRepository,
            libraryRepository,
            actionRepository,
            sessionRepository,
            formatRepository,
            genreRepository,
            authorRepository
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
