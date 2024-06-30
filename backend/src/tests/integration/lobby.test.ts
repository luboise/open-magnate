import LobbyController from "../../database/controller/lobby.controller";
import UserSessionRepository from "../../database/repository/usersession.repository";
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
			const lobby =
				await LobbyController.GetByLobbyId(-1);
			expect(lobby).toBeTruthy();

			const userSessions =
				await LobbyController.getUserSessions(-1);

			expect(userSessions).toHaveLength(2);
		});

		test("Expect existing lobbies to be returned with the players included", async () => {
			const lobby =
				await LobbyController.GetByLobbyId(-1);
			expect(lobby).toBeTruthy();
			expect(lobby!.players).toHaveLength(2);
		});
	});

	describe("Creating new lobbies", () => {
		test("Expect NewLobby() to pass with existing users", async () => {
			const EXPECTED_LENGTH = 5;

			const users =
				await UserSessionRepository.findMany({
					where: {
						name: { startsWith: "outoflobby-" }
					}
				});

			if (users.length !== EXPECTED_LENGTH) {
				throw new Error(
					`Seed data error - expected ${EXPECTED_LENGTH} users`
				);
			}

			const lobby = await LobbyController.NewLobby(
				users,
				{
					name: "testlobby-existing-users",
					password: "",
					playerCount: EXPECTED_LENGTH
				}
			);

			expect(lobby).toBeTruthy();
			expect(lobby).toHaveProperty("id");
			expect(lobby).toHaveProperty("inviteCode");

			const lobbyPlayers = (
				await LobbyController.GetByLobbyId(
					lobby!.id
				)
			)?.players;
			expect(lobbyPlayers).toBeTruthy();
			expect(lobbyPlayers).toHaveLength(
				EXPECTED_LENGTH
			);
			expect(
				lobbyPlayers!.length
			).toBeLessThanOrEqual(lobby!.playerCount);

			// Make sure the lobby has a host
			expect(
				lobbyPlayers!.some((player) => player.host)
			).toBeTruthy();
		});
	});
});

