import { SEED_USERS } from "./UserSessionSeeds";

const seedLobby1 = {
	lobbyId: -1,
	name: "test-lobby-1",
	password: "",
	inviteCode: "TESTLB01",
	playerCount: 2,
	lobbyPlayers: [SEED_USERS[0], SEED_USERS[1]]
};

export const SEED_LOBBIES = [seedLobby1];
export const SEED_LOBBY_PLAYERS = [];
