import { LocalActionRepository } from "@/repositories/ActionRepository";
import { api } from "@/services/axios";
import { SQLiteDatabase } from "expo-sqlite";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SynchronisationController } from "@/controllers/SynchronisationController";

export interface SynchronisationProxyProps {
    service: string;
    action: LocalActionRepository;
    controller: SynchronisationController;
    runSync: () => void;
}

export class SynchronisationProxy implements SynchronisationProxyProps {
    service: string;
    action: LocalActionRepository;
    controller: SynchronisationController;

    constructor(service: string, tableName: string, controller: SynchronisationController, db: SQLiteDatabase) {
        this.service = service;
        this.action = new LocalActionRepository(tableName, db);
        this.controller = controller;
    }

    async runSync() {
        // try {
        if (Platform.OS === "web") return // TODO: Check if needed, normally the function should not be called on web

        console.log("Synchronisation en cours...");

        const actionsFront = await this.action.getAll();
        const encodedActions = actionsFront.map((actionItem) => {
            const actionBase64 = btoa(JSON.stringify(actionItem.action));
            return {
                ...actionItem,
                action: actionBase64,
            };
        });

        console.log("Actions encodées en Base64 :", encodedActions);

        const lastSync = await AsyncStorage.getItem(`${this.service}_last_sync`) || "0";
        const response = await api.post(
            `/${this.service}/synchro/${lastSync}`,
            encodedActions,
        );

        this.controller.processActions(response.data);

        // TODO récupération des actions du back
        // TODO éxecution des actions dans l'ordre
        // TODO recup des isbn des livres
        // TODO comparaison des isbn server et client
        // TODO faire un getBook si il manque des livres

        // } catch (error) {
        //     console.error("Erreur lors de la synchronisation :", error);
        // }
    }
}
