import { Lobby } from "@prisma/client";
import { SEED_USERS } from "./UserSessionSeeds";

const seedLobby1: Partial<Lobby> = {
	id: -1,
	name: "test-lobby-1",
	password: "",
	inviteCode: "TESTLB01",
	playerCount: 2,
	: [SEED_USERS[0], SEED_USERS[1]]
};

export const SEED_LOBBIES = [seedLobby1];
export const SEED_LOBBY_PLAYERS = [];
