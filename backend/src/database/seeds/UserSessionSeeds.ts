import { UserSession } from "@prisma/client";

export const seedUser1: Partial<UserSession> = {
	sessionKey: "1",
	browserId: "test-browser-1",
	name: "test-player-1"
};

export const seedUser2 = {
	sessionKey: "2",
	browserId: "test-browser-2",
	name: "test-player-2"
};

export const SEED_USERS = [seedUser1, seedUser2];
