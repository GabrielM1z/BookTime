import { BookControllerProps } from "@/controllers/BookController";
import { UserControllerProps } from "@/controllers/UserController";
import { bookControllerFactory } from "@/controllers/factories/bookControllerFactory";
import { userControllerFactory } from "@/controllers/factories/userControllerFactory";
import React, { createContext } from "react";

export interface ControllerContextProps {
    userController: UserControllerProps;
    bookController: BookControllerProps;
}

export interface ControllerProviderProps {
    children: React.ReactNode;
    id_user: string;
}

export const ControllerContext = createContext<ControllerContextProps | undefined>(undefined);

export const ControllerProvider = ({
    children,
    id_user,
}: ControllerProviderProps) => {
    const userController = userControllerFactory();
    const bookController = bookControllerFactory(id_user);

    return (
        <ControllerContext.Provider value={{
            userController,
            bookController,
        }}>
            {children}
        </ControllerContext.Provider>
    );
}
