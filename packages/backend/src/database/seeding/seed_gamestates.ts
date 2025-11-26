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
	players: [Player.create(), Player.create()],
	bankReserve: 100,
	marketingTiles: [],
	readyStatuses: [false, false]
};
