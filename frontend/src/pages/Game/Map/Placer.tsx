import "./Placer.css";

import RestaurantImage from "../../../global_components/RestaurantImage";
import useClientState from "../../../hooks/game/useClientState";
import { useBoardInfo } from "../../../hooks/game/useMap";
import { MapOverlayTile } from "../../../utils";

type Props = {};

function Placer({}: Props) {
	// const { hovering } = useMapTileInteraction();

	const {
		currentlyPlacingTile,
		tileBeingPlaced,
		updatePlacement,
		rotatePlacement
	} = useClientState();

	const boardInfo = useBoardInfo();
	// const { onMapObjectClicked, onMapObjectHovered } =
	// 	useMap();

	const tile = currentlyPlacingTile
		? tileBeingPlaced
		: null;

	// onMapObjectClicked((event) => {
	// 	console.log("clicked", event);
	// });

	// onMapObjectHovered((event) => {
	// 	updatePlacement({
	// 		pos: {
	// 			x: Clamp(
	// 				event.data.x,
	// 				0,
	// 				boardInfo.width - 2,
	// 				true
	// 			),
	// 			y: Clamp(
	// 				event.data.y,
	// 				0,
	// 				boardInfo.height - 2,
	// 				true
	// 			)
	// 		}
	// 	});
	// });

	function IsValidPlacement(tile: MapOverlayTile) {
		// TODO: Implement placement logic
		return true;
	}

	const onScroll = (event: any) => {
		event.preventDefault();
		event.stopPropagation();

		rotatePlacement(
			event.deltaY > 0 ? "BACKWARDS" : "FORWARDS"
		);
	};

	console.debug("TILE: ", tile);

	if (!tile) return <></>;

	const rotated: boolean =
		tile.rotation === 90 || tile.rotation === 270;

	const mapWidth = rotated ? tile.width : tile.height;
	const mapHeight = rotated ? tile.height : tile.width;

	const valid = IsValidPlacement(tile);

	return (
		<div
			className="tile-being-placed"
			style={{
				gridColumn: `${tile.pos.x + 1} / span ${mapWidth}`,
				gridRow: `${tile.pos.y + 1} / span ${mapHeight}`
			}}
		>
			{tile.tileType === "RESTAURANT" ? (
				<RestaurantImage
					restaurantNumber={tile.restaurant ?? 1}
					style={{
						// gridColumn: `${tile.pos.x + 1} / span 2`,
						// gridRow: `${tile.pos.y + 1} / span 2`,
						opacity: valid ? 1 : 0.5,
						// Red if invalid placement
						backgroundColor: valid
							? undefined
							: "red",
						backgroundBlendMode: "multiply",

						width: "100%",
						height: "100%",
						// Span 2 rows and 2 columns

						// mixBlendMode: "multiply",

						border: "1px solid black",
						zIndex: 2
					}}
					// onWheel={onScroll}
					onScroll={onScroll}
					onWheel={onScroll}
					// onClick={submitRestaurant}
				/>
			) : (
				<></>
			)}
		</div>
	);
}

export default Placer;

