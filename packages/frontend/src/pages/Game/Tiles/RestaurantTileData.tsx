import { Position, RestaurantTile } from "magnate-core";
import useGameStateView from "../../../hooks/game/useGameStateView";

export function GetMyRestaurantTile(): RestaurantTile {
	const { gameState } = useGameStateView();

	return RestaurantTile.create(
		Position.create(0, 0),
		gameState!.playerIndex,
		false
	);
}
