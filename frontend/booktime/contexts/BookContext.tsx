import { BookControllerProps } from "@/controllers/BookController";
import { bookControllerFactory } from "@/controllers/factories/bookControllerFactory";
import { ContextNotFound } from "@/errors/ContextNotFound";
import React, { createContext, useEffect } from "react";
import { useAuthContext } from "./AuthContext";

export interface BookProviderProps {
    children: React.ReactNode;
    id_user: string;
}

export interface BookContextProps {
    bookController: BookControllerProps;
}

const BookContext = createContext<BookContextProps | undefined>(undefined);

export const BookProvider = ({
    children,
    id_user,
}: BookProviderProps) => {
    const bookController = bookControllerFactory(id_user);
    const { session } = useAuthContext();

    useEffect(() => {
        bookController.enter();
        return () => {
            bookController.exit();
        }
    }, []);

    return (
        <BookContext.Provider key={id_user} value={{ bookController }}>
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
