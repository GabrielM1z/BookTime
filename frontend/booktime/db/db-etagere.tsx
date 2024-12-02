import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('booktime.db');

// Fonction pour ajouter une bibliothèque (étagère)
export const addLibrary = async (name: any) => 
{
    const statement = await db.prepareAsync(
        'INSERT INTO library (name) VALUES ($name);'
    );

	try {
        let result = await statement.executeAsync({ 
            $name: name
        });
        console.log("result : ", result)        
	} catch (error) {
		console.error('Error insert into Librairy', error);
	}
}

// Fonction pour recupérer toute les étagères
export const getAllLibrary = async () => 
{
    try {
        let allRows = await db.getAllAsync('SELECT * FROM library');
        return allRows;
	} catch (error) {
		console.error('Error insert into Librairy', error);
	}
    return [];
}