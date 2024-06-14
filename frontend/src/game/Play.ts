import { GameState, TurnProgress } from "./GameState";
import { MapTileData } from "./MapData";
import { Player } from "./Player";

function NewGame(): GameState {
	const mapTiles: MapTileData[] = [];
	const players: Player[] = [];

	const houses: House[] = [];

	return {
		currentPlayer: -1,
		turnProgress: TurnProgress.RESTAURANT_PLACEMENT,
		currentTurn: 1,
		turnOrder: null,
		houses: houses,
		mapTiles,
		players
	};
}
