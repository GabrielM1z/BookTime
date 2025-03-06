import { LocalActionRepository } from "@/repositories/ActionRepository";
import { api } from "@/services/axios";
import { SQLiteDatabase } from "expo-sqlite";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SynchronisationController } from "@/controllers/SynchronisationController";
import { actionEncode } from "@/helpers/parser";
import { VariableRepository } from "@/repositories/VariableRepository";
import { guestUserId } from "@/constants";

export interface SynchronisationProxyProps {
    service: string;
    action: LocalActionRepository;
    controller: SynchronisationController;
    runSync: () => void;
}

export class SynchronisationProxy implements SynchronisationProxyProps {
    service: string;
    action: LocalActionRepository;
    variable: VariableRepository;
    controller: SynchronisationController;
    syncFlag: boolean = false;
    private syncing = false;
    private idUser: string;

    constructor(service: string, tableName: string, controller: SynchronisationController, db: SQLiteDatabase, idUser: string) {
        this.service = service;
        this.action = new LocalActionRepository(tableName, db, idUser);
        this.variable = new VariableRepository(db);
        this.controller = controller;
        this.idUser = idUser;
    }

    async runSync() {
        // console.log("Synchronisation demandée", this.syncFlag, this.syncing);
        if (this.idUser === guestUserId) return;
        if (this.syncFlag) return;
        this.syncing = true;

        if (Platform.OS === "web") return // TODO: Check if needed, normally the function should not be called on web

        console.log("Synchronisation en cours...");

        const actionsFront = await this.action.getAll();
        const encodedActions = actionsFront.map((actionItem) => {
            const actionBase64 = actionEncode(actionItem.action);
            return {
                ...actionItem,
                action: actionBase64,
            };
        });

        console.log("Actions encodées en Base64 :", encodedActions);

        try {
            const lastSync = await AsyncStorage.getItem(`${this.service}_last_sync`) || "2006-01-02T15:04:05Z";
            const response = await api.post(
                `/${this.service}/synchro/${lastSync}`,
                encodedActions,
            );

            await this.controller.sync.action.deleteAll();
            await AsyncStorage.setItem(`${this.service}_last_sync`, response.data.sync_date);

            this.controller.processActions(response.data);
        } catch (error) {
            console.error("Erreur lors de la synchronisation :", error);
        } finally {
            this.syncing = false;
        }
    }
}
