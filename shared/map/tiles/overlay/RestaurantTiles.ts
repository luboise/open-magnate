import { MapOverlayTileInterface } from "../";

export interface RestaurantTile
	extends MapOverlayTileInterface {
	tileType: "RESTAURANT";
	restaurant: number;
	width: 2;
	height: 2;
}
