import { Alert } from "react-native";
import { baseURL } from "@/constants/Api";
import axios from "axios";

export const testServeur = async () => {
    if (__DEV__) {
        await axios.head(baseURL).catch(() => {
            Alert.alert(
                "Serveur non disponible",
                "Le serveur n'est pas disponible. Veuillez vérifier votre connexion internet.",
                [{"text": "OK"}]
            )
        })
    }
}