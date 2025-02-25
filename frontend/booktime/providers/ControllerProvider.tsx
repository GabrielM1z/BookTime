import { UserController } from "@/controllers/UserController";
import React, { createContext } from "react";
import { SQLiteProvider, SQLiteProviderProps } from "./SQLiteProvider";
import { useSQLite } from "@/hooks/useSQLite";
import { BookController } from "@/controllers/BookController";


export interface ControllerContextProps {
    userController: UserController;
    bookController: BookController;
}

export const ControllerContext = createContext<ControllerContextProps | undefined>(undefined);

export const ControllerProviderInner = ({ children }: { children: React.ReactNode }) => {
    const { db } = useSQLite();

    const userController = new UserController();
    const bookController = new BookController(db);

    return (
        <ControllerContext.Provider value={{
            userController,
            bookController
        }}>
            {children}
        </ControllerContext.Provider>
    );
}

export const ControllerProvider = ({ children, ...props }: SQLiteProviderProps) => {
    return (
        <SQLiteProvider {...props}>
            <ControllerProviderInner>
                {children}
            </ControllerProviderInner>
        </SQLiteProvider>
    );
}
