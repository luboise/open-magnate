import { SEED_DATA } from "../database/SeedData";
import UserSessionController from "../database/controller/usersession.controller";
import { UserSession } from "../database/entity/UserSession";
import { SEED_USERS } from "../database/seeds/UserSession";
import { basicAfterEach, basicBeforeEach } from "./utils";

beforeEach(async () => {
	await basicBeforeEach();
});

afterEach(async () => {
	await basicAfterEach();
});

describe("Testing User", () => {
	test("Expect seed user to be found by browser ID", async () => {
		const browserId = SEED_USERS[0].browserId;
		const user =
			await UserSessionController.FindByBrowserId(
				browserId
			);

		expect(user).toBeInstanceOf(UserSession);
		expect(user).toBeTruthy();
		expect(user?.browserId).toBe(browserId);
	});

	test("Expect user to be created from browserId", async () => {
		const TEST_BROWSER_ID = "thetestuser";
		const newUser =
			await UserSessionController.New(
				TEST_BROWSER_ID
			);
		expect(newUser).toBeInstanceOf(UserSession);
		expect(newUser).toBeTruthy();
		expect(newUser?.browserId).toBe(TEST_BROWSER_ID);
	});

	test("Expect users to be found by session key", async () => {
		const user = await UserSessionController.GetDeep(
			SEED_DATA.seedUser1.sessionKey
		);

		expect(user).toBeTruthy();
	});
});

