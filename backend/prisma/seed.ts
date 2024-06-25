import prisma from "../src/datasource";

import { RESTAURANT_NAMES } from "../../shared";

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
	(res) => {
		return {
			name: res
		};
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

export const seedLobby1 = {
	id: -1,
	name: "seed-lobby-unstarted",
	password: "",
	inviteCode: "SEEDLB01",
	playerCount: 2
};

async function main() {
	try {
		await prisma.lobbyPlayer.deleteMany({});
		await prisma.lobby.deleteMany({});
		await prisma.restaurant.deleteMany({});
		await prisma.userSession.deleteMany({});

		await prisma.userSession.createMany({
			data: SEED_USERS
		});

		await prisma.restaurant.createMany({
			data: SEED_RESAURANTS.map((res, index) => ({
				name: res.name,
				id: index + 1
			}))
		});

		// await Promise.all(
		// 	SEED_USERS.map(async (user) => {
		// 		await prisma.userSession.upsert({
		// 			where: { sessionKey: user.sessionKey },
		// 			create: user,
		// 			update: {
		// 				name: user.name,
		// 				browserId: user.browserId
		// 			}
		// 		});
		// 	})
		// );

		await prisma.lobby.create({
			data: {
				...seedLobby1
			}
		});

		await prisma.lobbyPlayer.create({
			data: {
				userSession: {
					connect: {
						sessionKey: seedUser1.sessionKey
					}
				},
				lobby: { connect: { id: seedLobby1.id } },
				restaurant: {
					connect: { id: 1 }
				}
			}
		});

		await prisma.lobbyPlayer.create({
			data: {
				userSession: {
					connect: {
						sessionKey: seedUser2.sessionKey
					}
				},
				lobby: { connect: { id: seedLobby1.id } },
				restaurant: {
					connect: { id: 2 }
				}
			}
		});

		await prisma.$disconnect();
	} catch (error) {
		console.error("Unable to seed the database.");
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	}
}

main();

// importable reseed function that can be used during testing
export async function reseedDatabase() {
	await main();
}

export const SEED_USERS = [seedUser1, seedUser2];

export const SEED_LOBBIES = [seedLobby1];
