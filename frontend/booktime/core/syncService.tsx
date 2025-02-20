import { useRepositoryContext } from "@/hooks/useRepository";
import api from "@/services/axios";


export const syncDB = async() => {

	const { actionRepository } = useRepositoryContext();

	try {
		console.log("pre action")

		// TODO appel DB front : fetch action
		const actionsFront = await actionRepository.getAll();

		const actionsWithBase64 = actionsFront.map((actionItem) => {
			const actionBase64 = btoa(JSON.stringify(actionItem.action)); // Encodage en Base64
			const isoDate = new Date(actionItem.date).toISOString();
			
			return {
				...actionItem, // Conserve les autres champs de l'élément
				action: actionBase64, // Remplace "action" par sa version encodée
				date: isoDate,
			};
		});
	
		console.log("Actions encodées en Base64 :", actionsWithBase64);

		// TODO appel API : send action
		const url = "/books/synchro"
		const param = actionsWithBase64
		const actionsBack = api
			.post(url, param)
			// TODO récupération des actions du back
			.then((response) => {
				console.log("Actions recup :", response.data);
				
				// TODO suppr la table action local
				try {
					//actionRepository.deleteAll
				}


				// TODO éxecution des actions dans l'ordre
			})
			.catch((error) => {
				console.error('Erreur:', error.message);
			})

	} catch (error) {
		console.error("Erreur lors de la synchronisation :", error);
	}

}



