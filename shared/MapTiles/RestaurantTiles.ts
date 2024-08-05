import { BaseTile } from "./Tile";

export interface RestaurantTile extends BaseTile {
	tileType: "RESTAURANT";
	restaurant: number;
}

