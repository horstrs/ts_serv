import type { MigrationConfig } from "drizzle-orm/migrator";

type APIConfig = {
  fileserverHits: number;
  db: DBConfig;
  platform: string;
};
type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

process.loadEnvFile();
function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;;
}

const dbConfig: DBConfig = {
  url: envOrThrow("DB_URL"),
  migrationConfig: migrationConfig
}
export const config: APIConfig = {
  fileserverHits: 0,
  db: dbConfig,
  platform: envOrThrow("PLATFORM"),
};