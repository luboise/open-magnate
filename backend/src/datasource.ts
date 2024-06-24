import { PrismaClient } from "@prisma/client";

// export async function setupDatabase(dropAll?: boolean) {
// 	await dataSource.initialize();
// 	await dataSource.synchronize(Boolean(dropAll));
// 	await dataSource.runMigrations();
// 	// await dataSource.synchronize(Boolean(dropAll));
// }

// export async function teardownDatabase() {
// 	await dataSource.destroy();
// }

const prisma = new PrismaClient();
export default prisma;
