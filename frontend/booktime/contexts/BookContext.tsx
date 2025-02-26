import { BookControllerProps } from "@/controllers/BookController";
import { bookControllerFactory } from "@/controllers/factories/bookControllerFactory";
import { ContextNotFound } from "@/errors/ContextNotFound";
import React, { createContext } from "react";

export interface BookContextProps {
    children: React.ReactNode;
    id_user: string;
}

const BookContext = createContext<BookControllerProps | undefined>(undefined);

export const BookProvider = ({
    children,
    id_user,
}: BookContextProps) => {
    const bookController = bookControllerFactory(id_user);

    return (
        <BookContext.Provider key={id_user} value={bookController}>
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
