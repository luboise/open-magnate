import { DataSource, DataSourceOptions } from "typeorm";

const ormConfig =
	require("../../config/ormconfig.json") as DataSourceOptions;

if (!ormConfig) {
	throw new Error(
		"Missing or invalid ormconfig.json file."
	);
}

export async function setupDatabase(dropAll?: boolean) {
	await dataSource.initialize();
	await dataSource.synchronize();
	await dataSource.runMigrations();
	// await dataSource.synchronize(Boolean(dropAll));
}

export async function teardownDatabase() {
	await dataSource.destroy();
}

const dataSource = new DataSource(ormConfig);
const entityManager = dataSource.manager;

export { dataSource, entityManager };
