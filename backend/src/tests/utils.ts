import {
	dropEverything,
	reseedDatabase
} from "../../prisma/seed";

export async function basicBeforeEach() {
	await dropEverything();

	await reseedDatabase();
	// await reseedDatabase();
}

export async function basicAfterEach() {
	// await teardownDatabase();
	// await reseedDatabase();
}
