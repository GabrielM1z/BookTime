import { Alert } from "react-native";
import { keycloak } from "@/services/axios";


export const testServeur = async () => {
    if (__DEV__) {
        await keycloak.head("").catch((error) => {
            console.error(error);
            Alert.alert(
                "Serveur non disponible",
                "Le serveur n'est pas disponible. Veuillez vérifier votre connexion internet.",
                [{"text": "OK"}]
            )
        })
    }
}