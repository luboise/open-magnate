import "./TilePlacer.css";

import { useCallback, useEffect, useMemo } from "react";
import RestaurantImage from "../../../../global_components/RestaurantImage";
import useClientState from "../../../../hooks/game/useClientState";
import { useDerivedGameState } from "../../../../hooks/game/useDerivedGameState";
import useMap, { useBoardInfo } from "../../../../hooks/game/useMap";
import MapMarketingTile from "../Tiles/MapMarketingTile";
import useGameStateView from "../../../../hooks/game/useGameStateView";
import { GameState, Position, RestaurantTile } from "magnate-core";

type Props = {};

function TilePlacer({ }: Props) {
	const {
		currentlyPlacingTile,
		tileBeingPlaced,
		rotatePlacement,
		commitPlacement,
		updatePlacement,
		startPlacing
	} = useClientState();

	const { gameStatus, isMyTurn } = useDerivedGameState();
	const { gameState } = useGameStateView();
	if (!gameState) return <></>;

	const { onMapHovered } = useMap();

	const boardInfo = useBoardInfo();
	// const { onMapObjectClicked, onMapObjectHovered } =
	// 	useMap();

	const tile = currentlyPlacingTile
		? tileBeingPlaced
		: null;

	useEffect(() => {
		onMapHovered((position) => {
			updatePlacement({ position: { ...position } });
		});
	}, []);

	const validPlacement = useMemo(() => {
		if (!tile) return false;

		return GameState.canPlaceTile(gameState as unknown as GameState, tile);
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

	useEffect(() => {
		if (
			(gameStatus === "PLACING_FIRST_RESTAURANTS" || gameStatus === "PLACING_FIRST_RESTAURANTS_WAVE_TWO") &&
			isMyTurn
		) {
			console.debug("Placing restaurant tile");
			startPlacing(RestaurantTile.create(Position(0, 0), gameState.playerIndex, false));
		}
	}, [gameStatus, isMyTurn]);

	if (!tile) return <></>;

	const rotated: boolean =
		tile.rotation === 0 || tile.rotation === 180;

	const mapWidth = rotated ? tile.width : tile.height;
	const mapHeight = rotated ? tile.height : tile.width;

	return (
		<div
			className="tile-being-placed"
			style={{
				gridColumn: `${tile.position.x + 1} / span ${mapWidth}`,
				gridRow: `${tile.position.y + 1} / span ${mapHeight}`,
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
					restaurantIndex={gameState.players[tile.ownerIndex].restaurantIndex ?? 1}
					style={{
						// gridColumn: `${tile.position.x + 1} / span 2`,
						// gridRow: `${tile.position.y + 1} / span 2`,
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

export default TilePlacer;
