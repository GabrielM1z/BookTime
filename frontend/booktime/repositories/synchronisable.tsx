import api from '@/services/api';
import { ActionRepository } from './ActionRepository';
import { useRepositoryContext } from '@/hooks/useRepository';

export class Synchronisable {
    async sync() {
        const { actionRepository } = useRepositoryContext();
        try {
            console.log("pre action")
    
            // TODO appel DB front : fetch action
            const actionsFront = await actionRepository.getAll();
    
            const actionsWithBase64 = actionsFront.map((actionItem) => {
                const actionBase64 = btoa(JSON.stringify(actionItem.action)); // Encodage en Base64
                return {
                    ...actionItem, // Conserve les autres champs de l'élément
                    action: actionBase64, // Remplace "action" par sa version encodée
                };
            });
        
            console.log("Actions encodées en Base64 :", actionsWithBase64);
    
            // TODO appel API : send action
            const url = "/api/synchro"
            const param = actionsWithBase64
            const actionsBack = api.post(url, param)
    
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