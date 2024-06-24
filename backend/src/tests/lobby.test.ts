import LobbyController from "../database/controller/lobby.controller";
import { basicAfterEach, basicBeforeEach } from "./utils";

beforeEach(async () => {
	await basicBeforeEach();
});

afterEach(async () => {
	await basicAfterEach();
});

describe("Testing lobby", () => {
	test("Expect lobby to be empty when created", async () => {
		const lobby = await LobbyController.Get(-1);
		expect(lobby).toBeTruthy();

		const userSessions =
			await LobbyController.getPlayersFrom(lobby!);

		expect(userSessions).toHaveLength(2);
	});
});
