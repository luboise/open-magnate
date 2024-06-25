import { reseedDatabase } from "../../prisma/seed";

export async function basicBeforeEach() {
	await reseedDatabase();
}

export async function basicAfterEach() {
	// await teardownDatabase();
}
