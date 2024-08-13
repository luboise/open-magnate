import { RestaurantTile, TileType } from "../../../utils";

export function GetMyRestaurantTile(): RestaurantTile {
	return {
		tileType: TileType.RESTAURANT,
		restaurant: 1,
		pos: { x: 0, y: 0 },
		rotation: 0,
		width: 2,
		height: 2
	};
}
