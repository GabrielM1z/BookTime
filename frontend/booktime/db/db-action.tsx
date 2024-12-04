import { SQLiteDatabase } from 'expo-sqlite';

// Fonction pour recupérer toute les étagères
export const getAllAction = async (db: SQLiteDatabase) => 
{
	try {
		let allRows = await db.getAllAsync('SELECT * FROM action');
		return allRows;
	} catch (error) {
		console.error('Error fetch all action : ', error);
	}
	return [];
}