import { ActionRepository } from "@/repositories/ActionRepository";
import { AuthorRepository } from "@/repositories/AuthorRepository";
import { BookRepository } from "@/repositories/BookRepository";
import { FormatRepository } from "@/repositories/FormatRepository";
import { GenreRepository } from "@/repositories/GenreRepository";
import { LibraryRepository } from "@/repositories/LibraryRepository";
import { UserRepositoryProps, SQLiteUserRepository, APIUserRepository } from "@/repositories/UserRepository";
import { actionRepositoryFactory } from "@/repositories/factories/actionRepositoryFactory";
import { authorRepositoryFactory } from "@/repositories/factories/authorRepositoryFactory";
import { bookRepositoryFactory } from "@/repositories/factories/bookRepositoryFactory";
import { formatRepositoryFactory } from "@/repositories/factories/formatRepositoryFactory";
import { genreRepositoryFactory } from "@/repositories/factories/genreRepositoryFactory";
import { libraryRepositoryFactory } from "@/repositories/factories/libraryRepositoryFactory";
import { SQLiteProviderProps } from "expo-sqlite";
import { SQLiteProvider } from "./SQLiteProvider";
import React, { createContext } from "react";


export interface RepositoryContextProps {
    sqliteUserRepository: UserRepositoryProps;
    apiUserRepository: UserRepositoryProps;
    libraryRepository: LibraryRepository;
    bookRepository: BookRepository;
    actionRepository: ActionRepository;
    formatRepository: FormatRepository;
    genreRepository: GenreRepository;
    authorRepository: AuthorRepository;
}

export const RepositoryContext = createContext<RepositoryContextProps | undefined>(undefined);

function RepositoryProviderInner({ children }: { children: React.ReactNode }) {
    const sqliteUserRepository = new SQLiteUserRepository();
    const apiUserRepository = new APIUserRepository();

    const libraryRepository = libraryRepositoryFactory();
    const bookRepository = bookRepositoryFactory();
    const actionRepository = actionRepositoryFactory();
    const formatRepository = formatRepositoryFactory();
    const genreRepository = genreRepositoryFactory();
    const authorRepository = authorRepositoryFactory();

    return (
        <RepositoryContext.Provider value={{
            sqliteUserRepository,
            apiUserRepository,
            libraryRepository,
            bookRepository,
            actionRepository,
            formatRepository,
            genreRepository,
            authorRepository
        }}>
            {children}
        </RepositoryContext.Provider>
    );
}

export function RepositoryProvider({
    children,
    ...props
}: SQLiteProviderProps) {
    return (
        <SQLiteProvider {...props}>
            <RepositoryProviderInner>{children}</RepositoryProviderInner>
        </SQLiteProvider>
    );
}
