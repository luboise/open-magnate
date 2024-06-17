import { TileType } from "./MapData";

export type MapTileData = {
	x: number;
	y: number;
	type: TileType;
	data?: any;
};
