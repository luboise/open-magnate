import { BaseTile, TileType } from "./Tile";

export interface RestaurantTile extends BaseTile {
	tileType: TileType.RESTAURANT;
	restaurant: number;
	width: 2;
	height: 2;
}
