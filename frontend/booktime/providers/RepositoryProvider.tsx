import { ActionRepositoryProps } from "@/repositories/ActionRepository";
import { AuthorRepositoryProps } from "@/repositories/AuthorRepository";
import { BookRepositoryProps } from "@/repositories/BookRepository";
import { FormatRepositoryProps } from "@/repositories/FormatRepository";
import { GenreRepositoryProps } from "@/repositories/GenreRepository";
import { LibraryRepositoryProps } from "@/repositories/LibraryRepository";
import { SessionRepositoryProps } from "@/repositories/SessionRepository";
import { UserRepositoryProps } from "@/repositories/UserRepository";
import { actionRepositoryFactory } from "@/repositories/factories/actionRepositoryFactory";
import { authorRepositoryFactory } from "@/repositories/factories/authorRepositoryFactory";
import { bookRepositoryFactory } from "@/repositories/factories/bookRepositoryFactory";
import { formatRepositoryFactory } from "@/repositories/factories/formatRepositoryFactory";
import { genreRepositoryFactory } from "@/repositories/factories/genreRepositoryFactory";
import { libraryRepositoryFactory } from "@/repositories/factories/libraryRepositoryFactory";
import { sessionRepositoryFactory } from "@/repositories/factories/sessionRepositoryFactory";
import { userRepositoryFactory } from "@/repositories/factories/userRepositoryFactory";
import { SQLiteProvider, SQLiteProviderProps } from "expo-sqlite";
import React, { createContext } from "react";


export interface RepositoryContextProps {
    userRepository: UserRepositoryProps;
    libraryRepository: LibraryRepositoryProps;
    bookRepository: BookRepositoryProps;
    actionRepository: ActionRepositoryProps;
    sessionRepository: SessionRepositoryProps;
    formatRepository: FormatRepositoryProps;
    genreRepository: GenreRepositoryProps;
    authorRepository: AuthorRepositoryProps;
}

export const RepositoryContext = createContext<RepositoryContextProps | undefined>(undefined);

function RepositoryProvider({ children }: { children: React.ReactNode }) {
    const userRepository = userRepositoryFactory();
    const libraryRepository = libraryRepositoryFactory();
    const bookRepository = bookRepositoryFactory();
    const actionRepository = actionRepositoryFactory();
    const sessionRepository = sessionRepositoryFactory();
    const formatRepository = formatRepositoryFactory();
    const genreRepository = genreRepositoryFactory();
    const authorRepository = authorRepositoryFactory();

    return (
        <RepositoryContext.Provider value={{
            userRepository,
            libraryRepository,
            bookRepository,
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
