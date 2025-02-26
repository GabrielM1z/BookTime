import { ControllerContext } from "@/providers/ControllerProvider";
import { useContext } from "react";
import { ContextNotFound } from "@/errors/ContextNotFound";

export function useController() {
    const context = useContext(ControllerContext);
    if (!context) {
        throw new ContextNotFound("useController", "ControllerProvider");
    }
    return context;
}
