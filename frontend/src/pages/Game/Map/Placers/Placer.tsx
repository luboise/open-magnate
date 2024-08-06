import "./Placer.css";

import { useCallback, useMemo } from "react";
import RestaurantImage from "../../../../global_components/RestaurantImage";
import useClientState from "../../../../hooks/game/useClientState";
import { useGameStateView } from "../../../../hooks/game/useGameState";
import { useBoardInfo } from "../../../../hooks/game/useMap";
import MapMarketingTile from "../MapMarketingTile";

type Props = {};

function Placer({}: Props) {
	// const { hovering } = useMapTileInteraction();

	const {
		currentlyPlacingTile,
		tileBeingPlaced,
		rotatePlacement,
		commitPlacement
	} = useClientState();

	const { mapColOrder: map } = useGameStateView();

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

	const validPlacement = useMemo(() => {
		if (!tile) return false;

		const width =
			tile.rotation % 90 === 0
				? tile.width
				: tile.height;
		const height =
			tile.rotation % 0 ? tile.height : tile.width;

		for (
			let x = tile.pos.x;
			x < tile.pos.x + width;
			x++
		) {
			for (
				let y = tile.pos.y;
				y < tile.pos.y + height;
				y++
			) {
				if (
					x >= boardInfo.width ||
					y >= boardInfo.height
				)
					return false;

				if (map[x][y].tileType !== "EMPTY")
					return false;
			}
		}

		// TODO: Implement placement logic
		return true;
	}, [tile, boardInfo.width, boardInfo.height]);

	const attemptPlacement = useCallback(() => {
		if (!validPlacement) return;

		commitPlacement();
	}, [tile, validPlacement]);

	const onScroll = (event: any) => {
		event.preventDefault();
		event.stopPropagation();

		rotatePlacement(
			event.deltaY > 0 ? "BACKWARDS" : "FORWARDS"
		);
	};

	if (!tile) return <></>;

	const rotated: boolean =
		tile.rotation === 0 || tile.rotation === 180;

	const mapWidth = rotated ? tile.width : tile.height;
	const mapHeight = rotated ? tile.height : tile.width;

	return (
		<div
			className="tile-being-placed"
			style={{
				gridColumn: `${tile.pos.x + 1} / span ${mapWidth}`,
				gridRow: `${tile.pos.y + 1} / span ${mapHeight}`,
				opacity: validPlacement ? 1 : 0.8,
				// Red filter if invalid
				filter: validPlacement
					? undefined
					: "hue-rotate(0deg) grayscale(100%)"
				// filter: valid
				// 	? undefined
				// 	: "grayscale(100%)"
			}}
			onClick={attemptPlacement}
			onScroll={onScroll}
			onWheel={onScroll}
		>
			{tile.tileType === "RESTAURANT" ? (
				<RestaurantImage
					restaurantNumber={tile.restaurant ?? 1}
					style={{
						// gridColumn: `${tile.pos.x + 1} / span 2`,
						// gridRow: `${tile.pos.y + 1} / span 2`,
						// Red if invalid placement

						// backgroundBlendMode: "multiply",

						width: "100%",
						height: "100%",
						// Span 2 rows and 2 columns

						// mixBlendMode: "multiply",

						border: "1px solid black",
						zIndex: 2
					}}
				/>
			) : tile.tileType === "MARKETING" ? (
				<MapMarketingTile tile={tile} />
			) : (
				<></>
			)}
		</div>
	);
}

export default Placer;

