import { SQLiteActionRepository } from "@/repositories/ActionRepository"
import { SQLiteDatabase } from "expo-sqlite";
import { Platform } from "react-native";

export class SynchronisationController {
    action: SQLiteActionRepository;
    service: string;

    constructor(service: string, tableName: string, db: SQLiteDatabase) {
        this.action = new SQLiteActionRepository(tableName, db);
        this.service = service;
    }

    async runSynchronisation() {
        try {
            if (Platform.OS === "web") return // TODO: Check if needed, normally the function should not be called on web

            console.log("Synchronisation en cours...");

            // const { synchronisationController } = useController();

            // // TODO appel DB front : fetch action
            const actionsFront = await this.action.getAll();

            // const actionsWithBase64 = actionsFront.map((actionItem) => {
            //     const actionBase64 = btoa(JSON.stringify(actionItem.action)); // Encodage en Base64
            //     return {
            //         ...actionItem, // Conserve les autres champs de l'élément
            //         action: actionBase64, // Remplace "action" par sa version encodée
            //     };
            // });

            // console.log("Actions encodées en Base64 :", actionsWithBase64);

            // // TODO appel API : send action
            const url = `/${this.service}/synchro`
            // const param = actionsWithBase64
            // const actionsBack = api.post(url, param)

            // TODO récupération des actions du back


            // TODO éxecution des actions dans l'ordre


            // TODO recup des isbn des livres

            // TODO comparaison des isbn server et client

            // TODO faire un getBook si il manque des livres

        } catch (error) {
            console.error("Erreur lors de la synchronisation :", error);
        }
    }
}
