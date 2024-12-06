import { getAllAction } from "@/db/db-action"
import { useRepository } from "@/hooks/useRepository";
import api from "@/services/api";


export const syncDB = async() => {

    // TODO appel DB front : fetch action
	const { actionRepository } = useRepository();
	const actionsFront = await actionRepository.getAll();

	console.log("action", actionsFront)

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
	const param = actionsFront
	//const actionsBack = api.get(url, {"params": {"jsonData": actionsFront}})

	// TODO récupération des actions du back


	// TODO éxecution des actions dans l'ordre

}