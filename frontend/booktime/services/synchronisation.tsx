import { useController } from "@/hooks/useController";
import { ContextNotFound } from "@/errors/ContextNotFound";
import { Platform } from "react-native";

export async function runSynchronisation() {
    try {
        if (Platform.OS === "web") return 
        
        const { synchronisationController } = useController();

        // TODO appel DB front : fetch action
        const actionsFront = await synchronisationController.local.getAll();

        const actionsWithBase64 = actionsFront.map((actionItem) => {
            const actionBase64 = btoa(JSON.stringify(actionItem.action)); // Encodage en Base64
            return {
                ...actionItem, // Conserve les autres champs de l'élément
                action: actionBase64, // Remplace "action" par sa version encodée
            };
        });

        console.log("Actions encodées en Base64 :", actionsWithBase64);

        // TODO appel API : send action
        const url = "/synchro"
        const param = actionsWithBase64
        const actionsBack = api.post(url, param)

        // TODO récupération des actions du back


        // TODO éxecution des actions dans l'ordre


        // TODO recup des isbn des livres

        // TODO comparaison des isbn server et client

        // TODO faire un getBook si il manque des livres

    } catch (error) {
        if (error instanceof ContextNotFound) {
            console.warn("Context not found, skipping synchronisation");
        } else {
            console.error("Erreur lors de la synchronisation :", error);
        }
    }
}