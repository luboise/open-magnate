import { LobbySubmissionData } from "../../../../shared";
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
			expect(lobby!.playersInLobby).toHaveLength(2);
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

			const submissionData: LobbySubmissionData = {
				name: "testlobby-existing-users",
				password: "",
				playerCount: EXPECTED_LENGTH
			};

			const newLobby = await LobbyController.NewLobby(
				users[0],
				submissionData
			);

			expect(newLobby).toBeTruthy();

			for (const user of users.slice(1)) {
				const added =
					await LobbyController.addPlayer(
						newLobby!.id,
						user
					);
				expect(added).toBeTruthy();
			}

			const lobby =
				await LobbyController.GetByLobbyId(
					newLobby!.id
				);

			expect(lobby).toBeTruthy();
			expect(lobby?.playersInLobby).toBeTruthy();
			expect(lobby?.gameState).toBeTruthy();

			expect(lobby?.playersInLobby).toHaveLength(
				EXPECTED_LENGTH
			);
			expect(
				lobby?.playersInLobby.length
			).toBeLessThanOrEqual(
				lobby!.gameState!.playerCount
			);
			expect(lobby!.gameState).toBeTruthy();

			expect(lobby).toHaveProperty("id");
			expect(lobby).toHaveProperty("inviteCode");

			// Make sure the lobby has a host
			expect(
				lobby?.playersInLobby!.some(
					(player) => player.isHost
				)
			).toBeTruthy();
		});
	});
});
