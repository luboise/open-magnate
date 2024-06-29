import {
	dropEverything,
	reseedDatabase,
	seedUser1
} from "../../../prisma/seed";
import UserSessionController from "../../database/controller/usersession.controller";
import { basicAfterEach } from "./utils";

beforeEach(async () => {
	await dropEverything();
	await reseedDatabase();
});

afterEach(async () => {
	await basicAfterEach();
});

describe("Testing UserSession", () => {
	describe("Creating Usersessions", () => {
		test("Expect user to be created from browserId", async () => {
			const TEST_BROWSER_ID =
				"TESTUSERID123456789012345678";
			const newUser =
				await UserSessionController.New(
					TEST_BROWSER_ID
				);
			expect(newUser).toBeTruthy();
			expect(newUser?.browserId).toBe(
				TEST_BROWSER_ID
			);
		});
	});
	describe("Finding Usersessions", () => {
		test("Expect seed user to be found by browser ID", async () => {
			const browserId = seedUser1.browserId;
			const user =
				await UserSessionController.FindByBrowserId(
					browserId ?? null
				);

			expect(user).toBeTruthy();
			expect(user?.browserId).toBe(browserId);
		});

		test("Expect users to be found by session key", async () => {
			const sessionKey = seedUser1.sessionKey;

			const user =
				await UserSessionController.GetBySessionKey(
					sessionKey
				);

			expect(user).toBeTruthy();
		});

		test("Expect getDeep() to return the matched player with its underlying LobbyPlayer and Lobby attributes included", async () => {
			const user =
				await UserSessionController.GetDeep(
					seedUser1.sessionKey
				);
			try {
				expect(user).toBeTruthy();
				expect(user?.lobbyPlayer).toBeTruthy();
				expect(
					user?.lobbyPlayer?.lobby
				).toBeTruthy();
			} catch (error) {
				console.error(
					`Test failed. Check that both the user is correctly composed, and that the seeded LobbyPlayer data exists in the database.\nUser: ${JSON.stringify(user)}\n`
				);

				throw error;
			}
		});
	});
});
