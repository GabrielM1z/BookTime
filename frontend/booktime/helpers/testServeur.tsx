import { Alert } from "react-native";
import { baseURL } from "@/constants/Api";
import axios from "axios";

export const testServeur = async () => {
    if (__DEV__) {
        await axios.head(baseURL).catch((error) => {
            if (error.response) {

                // The server responded with a status code outside the 2xx range
          
                console.log('Error response:', error.response);
          
              } else if (error.request) {
          
                // The request was made but no response was received
          
                console.log('Error request:', error.request);
          
              } else {
          
                // Something happened in setting up the request that triggered an error
          
                console.log('Error message:', error.message);
          
              }
            Alert.alert(
                "Serveur non disponible",
                "Le serveur n'est pas disponible. Veuillez vérifier votre connexion internet.",
                [{"text": "OK"}]
            )
        })
    }
}