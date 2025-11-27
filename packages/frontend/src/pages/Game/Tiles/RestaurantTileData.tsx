import { RestaurantTile } from "magnate-core";

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
