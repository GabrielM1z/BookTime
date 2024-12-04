import { SQLiteDatabase } from 'expo-sqlite';

const listMigrations = () => {
  const context = require.context('./migrations', false, /^\.\/\d{3}_[a-zA-Z0-9_]+\.tsx$/);
  const migrations: Record<number, any> = {};

  context.keys().forEach((file) => {
    const versionMatch = file.match(/^\.\/(\d{3})_/);
    if (versionMatch) {
      const version = parseInt(versionMatch[1], 10);
      migrations[version] = context(file).default;
    }
  });

  // Retourner les migrations triées par version
  return Object.entries(migrations)
    .map(([version, migration]) => ({
      version: parseInt(version, 10),
      migration,
    }))
    .sort((a, b) => a.version - b.version);
};

export const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  const migrations = listMigrations();

  // Obtenir la version actuelle de la base
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = result ? result.user_version : 0;
  console.log('Version actuelle de la base :', currentVersion);

  for (const { version, migration } of migrations) {
    if (currentVersion < version) {
      console.log(`Application de la migration v${version}...`);
      try {
        await migration(db); // Exécuter la fonction de migration
        await db.execAsync(`PRAGMA user_version = ${version}`); // Mettre à jour la version
        console.log(`Migration v${version} appliquée avec succès.`);
      } catch (error) {
        console.error(`Erreur lors de la migration v${version}:`, error);
        throw error; // Arrêter le processus en cas d'échec
      }
    }
  }

  console.log('Toutes les migrations sont à jour.');
};
