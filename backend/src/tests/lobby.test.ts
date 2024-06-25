import LobbyController from "../database/controller/lobby.controller";
import UserSessionRepository from "../database/repository/usersession.repository";
import { basicAfterEach, basicBeforeEach } from "./utils";

beforeEach(async () => {
	await basicBeforeEach();
});

afterEach(async () => {
	await basicAfterEach();
});

describe("Testing lobby", () => {
	describe("Reading from existing lobbies", () => {
		test("Expect getPlayersFrom() to correctly return the playercount of seed lobby", async () => {
			const lobby = await LobbyController.Get(-1);
			expect(lobby).toBeTruthy();

			const userSessions =
				await LobbyController.getPlayersFrom(
					lobby!
				);

			expect(userSessions).toHaveLength(2);
		});

		test("Expect existing lobbies to be returned with the players included", async () => {
			const lobby = await LobbyController.Get(-1);
			expect(lobby).toBeTruthy();
			expect(lobby!.players).toHaveLength(2);
		});
	});

	describe("Creating new lobbies", () => {
		test("Expect NewLobby() to pass with existing users", async () => {
			const users =
				await UserSessionRepository.findMany({
					where: {
						name: { startsWith: "outoflobby-" }
					}
				});

			if (users.length !== 6) {
				throw new Error(
					"Seed data error - expected 6 users"
				);
			}

			const lobby = await LobbyController.NewLobby(
				users,
				{
					name: "testlobby-existing-users",
					password: "",
					playerCount: 6
				}
			);

			expect(lobby).toBeTruthy();
			expect(lobby).toHaveProperty("id");
			expect(lobby).toHaveProperty("inviteCode");

			const lobbyPlayers =
				await LobbyController.getPlayersFrom(
					lobby!
				);
			expect(lobbyPlayers).toHaveLength(6);
			expect(lobbyPlayers.length).toBeLessThanOrEqual(
				lobby!.playerCount
			);
		});
	});
});
