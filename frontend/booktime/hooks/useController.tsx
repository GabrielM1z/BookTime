import { ControllerContext } from "@/providers/ControllerProvider";
import { useContext } from "react";

export function useController() {
    const context = useContext(ControllerContext);
    if (!context) {
        throw new Error("useController must be used within a ControllerProvider");
    }
    return context;
}
