import { useCallback } from "react";
import { MOVE_TYPE } from "../../../../../../shared/Moves";
import useClientState, {
	OnTilePlacedCallback
} from "../../../../hooks/game/useClientState";
import { useGameStateView } from "../../../../hooks/game/useGameState";
import usePageGame from "../../../../hooks/game/usePageGame";
import useTurnPlanning from "../../../../hooks/game/useTurnPlanning";
import {
	MarketingAction,
	MarketingTile,
	RestaurantTile
} from "../../../../utils";

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
	placementTypes: string[];
}

function PlacementHandler({ placementTypes }: Props) {
	if (placementTypes.length === 0)
		throw new Error(
			"No placement types provided to PlacementHandler"
		);

	const { makeMove } = usePageGame();

	const { turnProgress, myEmployees } =
		useGameStateView();
	const { addAction } = useTurnPlanning();

	const onTileDropped = useCallback<OnTilePlacedCallback>(
		async (tile) => {
			console.debug("Handling tile drop: ", tile);

			if (!placementTypes.includes(tile.tileType))
				return;

			switch (turnProgress) {
				case "RESTAURANT_PLACEMENT": {
					if (tile.tileType !== "RESTAURANT")
						return;

					submitRestaurant(tile);
					break;
				}
				case "USE_EMPLOYEES": {
					if (tile.tileType !== "MARKETING")
						return;

					addMarketingAction(tile);
				}
			}
		},
		[]
	);

	const {} = useClientState(onTileDropped);

	// TODO: Implement actual house placement logic
	// if (event.type === "TILE" && event.data.type === "EMPTY")

	function submitRestaurant(tile: RestaurantTile) {
		makeMove({
			MoveType: MOVE_TYPE.PLACE_RESTAURANT,
			x: tile.pos.x,
			y: tile.pos.y,
			// TODO: Fix this to support all corner directions
			entrance: "TOPLEFT"
		});
	}

	function addMarketingAction(tile: MarketingTile) {
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
			console.debug(error);
		}
	}

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

