import { Player } from "./Player";
import { Reserve } from "./Reserve";
import { PlayerCount } from "./defaults";
import { GameMap } from "./map";
import { MarketingTile } from "./marketing/MarketingTile";

export interface GameState {
	reserve: Reserve;
	players: Player[];
	map: GameMap;
	marketingTiles: MarketingTile[];
	// tiles: MapTile[];
}

export interface NewGameParams {
	playerCount: PlayerCount;
}

export function newGame(params: NewGameParams): GameState {
	const reserve = Reserve.create(params.playerCount);
	const players = [];
	for (let i = 0; i < params.playerCount; i++) {
		players.push(Player.create());
	}

	const map = GameMap.create(params.playerCount);
	const marketingTiles: MarketingTile[] = [];

	return { reserve, players, map, marketingTiles };
}
