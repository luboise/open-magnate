import {
	CardReserve,
	GameState,
	Player
} from "magnate-core";

export const seedGameState1: GameState = {
	currentTurn: 0,
	map: {
		width: 15,
		height: 15,
		tiles: []
	},

	turnOrder: [0, 1],

	status: "PLACING_FIRST_RESTAURANTS",
	cardReserve: CardReserve.create(2),
	players: [Player.create(0), Player.create(1)],
	bankReserve: 100,
	marketingTiles: [],
	newTurnOrder: []
};
