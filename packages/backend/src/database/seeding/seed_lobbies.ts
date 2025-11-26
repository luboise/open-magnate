import { LOBBY_STATUS } from "../datasource/generated/enums";
import { seedGameState1 } from "./seed_gamestates";

export const seedLobby1 = {
	id: -1,
	name: "seed-lobby-unstarted",
	password: "",
	inviteCode: "SEEDLB01",
	gameState: seedGameState1,
	lobbyStatus: LOBBY_STATUS.PRE_LOBBY
};
export const SEED_LOBBIES = [seedLobby1];
