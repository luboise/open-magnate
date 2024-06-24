import {
	setupDatabase,
	teardownDatabase
} from "../datasource";

export async function basicBeforeEach() {
	await setupDatabase(true);
}

export async function basicAfterEach() {
	await teardownDatabase();
}
