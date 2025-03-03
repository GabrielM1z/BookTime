import { BookControllerProps } from "@/controllers/BookController";
import { bookControllerFactory } from "@/controllers/factories/bookControllerFactory";
import { ContextNotFound } from "@/errors/ContextNotFound";
import { usePersistentState } from "@/hooks/usePersistantState";
import React, { createContext, useEffect } from "react";

export interface BookProviderProps {
    children: React.ReactNode;
    id_user: string;
}

export interface BookContextProps {
    bookController: BookControllerProps;
    lastSync: string | null;
    setLastSync: (lastSync: string | null) => void;
}

const BookContext = createContext<BookContextProps | undefined>(undefined);

export const BookProvider = ({
    children,
    id_user,
}: BookProviderProps) => {
    const [lastSync, setLastSync] = usePersistentState<string | null>('book_lastSync', null);
    const bookController = bookControllerFactory(id_user);

    useEffect(() => {
        bookController.enter();
        return () => {
            bookController.exit();
        }
    }, []);

    return (
        <BookContext.Provider key={id_user} value={{ bookController, lastSync, setLastSync }}>
            {children}
        </BookContext.Provider>
    );
}

export const useBookContext = () => {
    const context = React.useContext(BookContext);
    if (context === undefined) {
        throw new ContextNotFound("useBookContext", "BookProvider");
    }
    return context;
}
