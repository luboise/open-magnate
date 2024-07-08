// import prisma from "../src/datasource";

import {
	Prisma,
	PrismaClient,
	PrismaPromise,
	RestaurantData,
	TURN_PROGRESS
} from "@prisma/client";
import { RESTAURANT_NAMES } from "../../shared";
// import prisma from "../src/datasource";

// const [
// 	seedRestaurant1,
// 	seedRestaurant2,
// 	seedRestaurant3,
// 	seedRestaurant4,
// 	seedRestaurant5,
// 	seedRestaurant6
// ]: Partial<Restaurant>[] = RESTAURANT_NAMES.map((res) => ({
// 	name: res
// }));
export const SEED_RESAURANTS = RESTAURANT_NAMES.map(
	(res, index) => {
		return {
			id: index + 1,
			name: res
		} as RestaurantData;
	}
);

export const [
	seedRestaurant1,
	seedRestaurant2,
	seedRestaurant3,
	seedRestaurant4,
	seedRestaurant5,
	seedRestaurant6
] = SEED_RESAURANTS;

export const seedUser1 = {
	sessionKey: "1",
	browserId: "seed-browser-1",
	name: "seed-player-1"
};

export const seedUser2 = {
	sessionKey: "2",
	browserId: "seed-browser-2",
	name: "seed-player-2"
};

export const seedUserOutOfLobby1 = {
	sessionKey: "outoflobby-1",
	browserId: "outoflobby-1",
	name: "outoflobby-1"
};

export const seedUserOutOfLobby2 = {
	sessionKey: "outoflobby-2",
	browserId: "outoflobby-2",
	name: "outoflobby-2"
};

export const seedUserOutOfLobby3 = {
	sessionKey: "outoflobby-3",
	browserId: "outoflobby-3",
	name: "outoflobby-3"
};

export const seedUserOutOfLobby4 = {
	sessionKey: "outoflobby-4",
	browserId: "outoflobby-4",
	name: "outoflobby-4"
};

export const seedUserOutOfLobby5 = {
	sessionKey: "outoflobby-5",
	browserId: "outoflobby-5",
	name: "outoflobby-5"
};

// export const seedUserOutOfLobby6 = {
// 	sessionKey: "outoflobby-6",
// 	browserId: "outoflobby-6",
// 	name: "outoflobby-6"
// };

export const SEED_USERS: Prisma.UserSessionCreateInput[] = [
	seedUser1,
	seedUser2,
	seedUserOutOfLobby1,
	seedUserOutOfLobby2,
	seedUserOutOfLobby3,
	seedUserOutOfLobby4,
	seedUserOutOfLobby5
	// seedUserOutOfLobby6
];

export const seedLobby1 = {
	id: -1,
	name: "seed-lobby-unstarted",
	password: "",
	inviteCode: "SEEDLB01"
};

export const seedGameState1: Prisma.GameStateCreateInput = {
	currentPlayer: 1,
	currentTurn: 0,
	lobby: {
		connect: { id: seedLobby1.id }
	},
	turnProgress: TURN_PROGRESS.RESTAURANT_PLACEMENT,
	playerCount: 2,
	rawMap: "RRRRRRRRRRRRRRR;RRRRRRRRRRRRRRR;RRRRRRRRRRRRRRR",
	players: {
		createMany: {
			data: [
				{
					number: 1,
					milestones: [],
					restaurantDataId: seedRestaurant1.id
				},
				{
					number: 2,
					milestones: [],
					restaurantDataId: seedRestaurant2.id
				}
			]
		}
	}
} as Prisma.GameStateCreateInput;

// TODO: Fix main throwing an error when running without debug mode on GitHub actions
async function main() {
	const prisma = new PrismaClient();
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

		for (const res of SEED_RESAURANTS) {
			transactions.push(
				prisma.restaurantData.upsert({
					where: {
						id: res.id
					},
					update: {
						name: res.name
					},
					create: {
						id: res.id,
						name: res.name
					}
				})
			);
		}

		transactions.push(
			prisma.lobby.upsert({
				where: { id: seedLobby1.id },
				update: seedLobby1,
				create: seedLobby1
			})
		);

		transactions.push(
			prisma.gameState.upsert({
				where: { id: seedLobby1.id },
				update: {},
				create: seedGameState1
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
			playerData: {
				connect: {
					gamePlayerId: {
						gameId: seedLobby1.id,
						number: 1
					}
				}
			}
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
			playerData: {
				connect: {
					gamePlayerId: {
						gameId: seedLobby1.id,
						number: 2
					}
				}
			}
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
	const prisma = new PrismaClient();

	const transactions: PrismaPromise<any>[] = [];
	transactions.push(
		prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`
	);

	const tablenames = await prisma.$queryRaw<
		Array<{ TABLE_NAME: string }>
	>`SELECT TABLE_NAME from information_schema.TABLES WHERE TABLE_SCHEMA = 'tests';`;

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
// async function deleteAllRowsFromAllTables() {
// 	try {
// 		// Start a transaction
// 		await prisma.$executeRaw`START TRANSACTION;`;

// 		// Disable foreign key checks
// 		await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;

// 		// Generate and execute DELETE statements for each table
// 		const tables = await prisma.$queryRaw`
//             SELECT table_name
//             FROM information_schema.tables
//             WHERE table_schema = 'your_database_name'
//             AND table_type = 'BASE TABLE';
//         `;

// 		for (const table of tables as {
// 			table_name: string;
// 		}[]) {
// 			const tableName = table.table_name;
// 			await prisma.$executeRaw`DELETE FROM ${tableName};`;
// 		}

// 		// Enable foreign key checks
// 		await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;

// 		// Commit transaction
// 		await prisma.$executeRaw`COMMIT;`;

// 		console.log(
// 			"All rows deleted from all tables successfully."
// 		);
// 	} catch (error) {
// 		// Rollback transaction on error
// 		await prisma.$executeRaw`ROLLBACK;`;
// 		console.error("Error deleting rows:", error);
// 	} finally {
// 		await prisma.$disconnect();
// 	}
// }

export const SEED_LOBBIES = [seedLobby1];

