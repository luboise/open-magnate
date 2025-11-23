import { UserSessionCreateInput } from "../datasource";

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
export const SEED_USERS: UserSessionCreateInput[] = [
	seedUser1,
	seedUser2,
	seedUserOutOfLobby1,
	seedUserOutOfLobby2,
	seedUserOutOfLobby3,
	seedUserOutOfLobby4,
	seedUserOutOfLobby5
	// seedUserOutOfLobby6
];

// export const seedUserOutOfLobby6 = {
// 	sessionKey: "outoflobby-6",
// 	browserId: "outoflobby-6",
// 	name: "outoflobby-6"
// };
