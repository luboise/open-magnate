const seedUser1 = {
	browserId: "test-browser-1",
	sessionKey: "test-session-key-1",
	name: "test-player-1"
};

const seedUser2 = {
	browserId: "test-browser-2",
	sessionKey: "test-session-key-2",
	name: "test-player-2"
};

const seedLobby1 = {
	lobbyId: -1,
	name: "test-lobby-1",
	password: "",
	inviteCode: "TESTLB01",
	playerCount: 2,
	lobbyPlayers: [seedUser1, seedUser2]
};

export const SEED_DATA = {
	seedUser1,
	seedUser2,
	seedLobby1
};
