import { useCallback } from "react";
import useClientState, {
	OnTilePlacedCallback
} from "../../../../hooks/game/useClientState";
import { useDerivedGameState } from "../../../../hooks/game/useDerivedGameState";
import usePageGame from "../../../../hooks/game/usePageGame";
import useTurnPlanning from "../../../../hooks/game/useTurnPlanning";
import { MapTileType, RestaurantTile, MoveType } from "magnate-core";

// interface RestaurantPlacerState {
// 	x: number;
// 	y: number;
// 	entrance: ENTRANCE_CORNER;
// }

// type RestaurantPlacerAction =
// 	| {
// 			action: "NEW_POSITION";
// 			x: number;
// 			y: number;
// 	  }
// 	| {
// 			action: "SET_ENTRANCE";
// 			entrance: ENTRANCE_CORNER;
// 	  }
// 	| {
// 			action: "PLACE_RESTAURANT";
// 	  };

interface Props {
	placementTypes: MapTileType[];
}

function PlacementHandler({ placementTypes }: Props) {
	if (placementTypes.length === 0)
		throw new Error(
			"No placement types provided to PlacementHandler"
		);

	const { makeMove } = usePageGame();

	const { gameStatus, employees: myEmployees } =
		useDerivedGameState();
	const { addAction } = useTurnPlanning();

	const onTileDropped = useCallback<OnTilePlacedCallback>(
		async (tile) => {
			console.debug("Handling tile drop: ", tile);

			if (!placementTypes.includes(tile.tileType)) {
				console.debug(
					`PlacementHandler can't handle ${tile.tileType}`
				);
				return;
			}

			switch (gameStatus) {
				case "PLACING_FIRST_RESTAURANTS":
				case "PLACING_FIRST_RESTAURANTS_WAVE_TWO": {
					if (tile.tileType !== "RESTAURANT")
						return;

					submitRestaurant(tile);
					break;
				}
				case "WORKING_NINE_TO_FIVE": {
					if (tile.tileType !== "MARKETING")
						return;

					// addMarketingAction(tile);
					break;
				}
			}
		},
		[]
	);

	const { } = useClientState(onTileDropped);

	// TODO: Implement actual house placement logic
	// if (event.type === "TILE" && event.data.type === "EMPTY")

	function submitRestaurant(tile: RestaurantTile) {
		console.debug(
			"Submitting restaurant placement: ",
			tile
		);
		makeMove({
			MoveType: MoveType.PLACE_RESTAURANT,
			x: tile.position.x,
			y: tile.position.y,
			// TODO: Fix this to support all corner directions
			entrance: "TOPLEFT"
		});
	}

	/*
	function addMarketingAction(tile: MarketingTile) {
		console.debug("Adding marketing action: ", tile);

		const index = tile.placingEmployee;
		try {
			if (index === -1) {
				throw new Error(
					`Attempted to market with an invalid employee index ${index}`
				);
			}

			const employee = myEmployees[index];
			if (!employee) {
				throw new Error(
					`No employee could be found for index ${index}`
				);
			}

			if (employee.type !== "MARKETING") {
				throw new Error(
					`Employee at index ${index} is not a marketing employee`
				);
			}

			const newAction: Omit<
				MarketingAction,
				"player"
			> = {
				type: "MARKETING",
				employeeIndex: tile.placingEmployee,
				tile: tile
			};

			addAction(newAction);
		} catch (error) {
			console.debug(
				"Unable to create marketing action: ",
				error
			);
		}
	}
	*/

	// useEffect(() => {
	// 	startPlacing({
	// 		tileType: "RESTAURANT",
	// 		width: 2,
	// 		height: 2,
	// 		rotation: 0,
	// 		pos: { x: 0, y: 0 },
	// 		restaurant: playerData.restaurant
	// 	});
	// }, []);

	return <></>;
}

export default PlacementHandler;
