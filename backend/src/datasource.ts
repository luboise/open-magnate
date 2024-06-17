import { DataSource, DataSourceOptions } from "typeorm";

const ormConfig =
	require("../../config/ormconfig.json") as DataSourceOptions;

if (!ormConfig) {
	throw new Error(
		"Missing or invalid ormconfig.json file."
	);
}

const dataSource = new DataSource(ormConfig);
const entityManager = dataSource.manager;

export { dataSource, entityManager };
