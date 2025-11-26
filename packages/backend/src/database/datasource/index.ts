import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";
import { PrismaClient } from "./generated/client";

export * from "./generated/client";
export * from "./generated/models";

const adapter = new PrismaMariaDb({
	database: process.env.DB_DATABASE_NAME,
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT) || 3307
});

const prisma = new PrismaClient({ adapter });

export { prisma };

export function ensurePrismaIsLoaded() {
	console.log("Prisma loaded: ", Boolean(prisma));
}
