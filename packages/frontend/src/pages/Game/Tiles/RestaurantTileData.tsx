import { RestaurantTile } from "../../../utils";

export function GetMyRestaurantTile(): RestaurantTile {
	return {
		level: "OVERLAY",
		tileType: "RESTAURANT",
		restaurant: 1,
		pos: { x: 0, y: 0 },
		rotation: 0,
		width: 2,
		height: 2
	};
}
