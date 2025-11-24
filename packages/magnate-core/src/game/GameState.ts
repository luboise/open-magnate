import { Player } from "./Player";
import { CardReserve } from "./Reserve";
import { PlayerCount } from "./defaults";
import { GameMap } from "./map";
import { MarketingTile } from "./marketing/MarketingTile";

export interface GameState {
	players: Player[];
	map: GameMap;
	cardReserve: CardReserve;
	bankReserve: number;
	marketingTiles: MarketingTile[];
	// tiles: MapTile[];
}

export interface NewGameParams {
	playerCount: PlayerCount;
	seed?: number;
}

export function newGame(params: NewGameParams): GameState {
	const reserve = CardReserve.create(params.playerCount);
	const players = [];
	for (let i = 0; i < params.playerCount; i++) {
		players.push(Player.create());
	}

	const map = GameMap.create(
		params.playerCount,
		params.seed
	);
	const marketingTiles: MarketingTile[] = [];

	return {
		cardReserve: reserve,
		players,
		map,
		marketingTiles,
		bankReserve: params.playerCount * 50
	};
}
