import { baseURL } from "@/constants/Api"
import { Alert } from "react-native";
import axios from "axios";

export const testServeur = async () => {
    if (__DEV__) {
        await axios.head(baseURL, { timeout: 2000 }).catch(() => {
            Alert.alert(
                "Serveur non disponible",
                "Le serveur n'est pas disponible. Veuillez vérifier votre connexion internet.",
                [{"text": "OK"}]
            )
        })
    }
}