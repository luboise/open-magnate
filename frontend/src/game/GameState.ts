import { MapTileData } from "./MapData";
import { Player } from "./Player";

type GameState = {
	players: Array<Player>;
	mapTiles: Array<MapTileData>;
};
