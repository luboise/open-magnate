import UserSessionRepository from "../src/database/repository/usersession.repository";
import { SEED_LOBBIES } from "../src/database/seeds/LobbySeeds";
import { SEED_USERS } from "../src/database/seeds/UserSessionSeeds";
import prisma from "../src/datasource";

async function SeedDatabase() {
	await UserSessionRepository.createMany({
		data: SEED_USERS
	});
	LobbyRepository.save(SEED_LOBBIES);
}

async function main() {
	try {
		await Promise.all(
				await prisma.userSession.upsert({
					where: { sessionKey: "1" },
					update: {
						
						sessionKey: "1",
						browserId: "test-browser-1",
						name: "test-player-1"
					}
				})
		);

		await Promise.all(
			SEED_LOBBIES.map(async (lobby) => {
                await prisma.lobby.upsert({
                    where: { id: lobby.lobbyId }
                    data: lobby
                });
            })
		)

		await prisma.$disconnect();
	} catch (error) {
		console.log(error);
		await prisma.$disconnect();
		process.exit(1);
	}
}

