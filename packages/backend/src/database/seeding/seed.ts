import { Prisma, prisma } from "../datasource";

import { seedLobby1 } from "./seed_lobbies";
import {
	SEED_USERS,
	seedUser1,
	seedUser2
} from "./seed_users";

import { PrismaPromise } from "../datasource/generated/internal/prismaNamespace";

// TODO: Fix main throwing an error when running without debug mode on GitHub actions
async function main() {
	try {
		const transactions = [];
		// // Delete lobby dependees
		// await prisma.gameState.deleteMany();
		// await prisma.lobbyPlayer.deleteMany();

		// // Delete lobby
		// await prisma.lobby.deleteMany();

		// // Delete Lobby dependents
		// await prisma.restaurant.deleteMany();

		for (const user of SEED_USERS) {
			transactions.push(
				prisma.userSession.upsert({
					where: {
						sessionKey: user.sessionKey
					},
					update: {
						name: user.name,
						browserId: user.browserId
					},
					create: user
				})
			);
		}

		transactions.push(
			prisma.lobby.upsert({
				where: { id: seedLobby1.id },
				update: JSON.parse(
					JSON.stringify(seedLobby1)
				),
				create: JSON.parse(
					JSON.stringify(seedLobby1)
				)
			})
		);

		const seedLP1: Prisma.LobbyPlayerCreateInput = {
			userSession: {
				connect: {
					sessionKey: seedUser1.sessionKey
				}
			},
			lobby: {
				connect: { id: seedLobby1.id }
			},
			playerIndex: 0
		};

		const seedLP2 = {
			userSession: {
				connect: {
					sessionKey: seedUser2.sessionKey
				}
			},
			lobby: {
				connect: { id: seedLobby1.id }
			},
			playerIndex: 1
		};

		transactions.push(
			prisma.lobbyPlayer.upsert({
				where: {
					userId: seedUser1.sessionKey
				},
				update: seedLP1,
				create: seedLP1
			})
		);

		transactions.push(
			prisma.lobbyPlayer.upsert({
				where: {
					userId: seedUser2.sessionKey
				},
				update: seedLP2,
				create: seedLP2
			})
		);

		await prisma.$transaction(transactions);

		await prisma.$disconnect();
		return;
	} catch (error) {
		console.error("Unable to seed the database.");
		console.error(error);
		await prisma.$disconnect();
		throw error;
	}
}

main();

// importable reseed function that can be used during testing
export async function reseedDatabase() {
	await main();
}

export async function dropEverything() {
	const transactions: PrismaPromise<any>[] = [];
	transactions.push(
		prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`
	);

	const tablenames = await prisma.$queryRaw<
		Array<{ TABLE_NAME: string }>
	>`SELECT TABLE_NAME from information_schema.TABLES WHERE TABLE_SCHEMA = 'te';`;

	for (const { TABLE_NAME } of tablenames) {
		if (TABLE_NAME !== "_prisma_migrations") {
			try {
				transactions.push(
					prisma.$executeRawUnsafe(
						`TRUNCATE ${TABLE_NAME};`
					)
				);
			} catch (error) {
				console.log({ error });
				throw error;
			}
		}
	}

	transactions.push(
		prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`
	);

	try {
		await prisma.$transaction(transactions);
	} catch (error) {
		console.log({ error });
	}
}
