import "./MagnateMap.css";

import {
	HTMLAttributes,
	PropsWithChildren,
	useMemo
} from "react";
import RestaurantImage from "../../../../components/RestaurantImage";
import { useGameState } from "../../../../hooks/useGameState";
import useMap from "../../../../hooks/useMap";
import {
	MAP_PIECE_HEIGHT,
	MAP_PIECE_WIDTH,
	MapTileData
} from "../../../../utils";
import House from "./House";
import MapTile from "./MapTile";

interface MapProps extends HTMLAttributes<HTMLDivElement> {}

function MagnateMap(props: PropsWithChildren<MapProps>) {
	// console.debug("Rendering magnate map.");
	const {
		// onTileClicked,
		children,
		style,
		...args
	} = props;

	const {
		sendMapObjectClickEvent: mapObjectClicked,
		sendMapObjectHoverEvent: mapObjectHovered,
		getAllRenderables
	} = useMap();

	const {
		mapRowOrder: map,
		houses,
		restaurants,
		players
	} = useGameState();

	// console.debug(
	// "Rendering magnate map.",
	// map,
	// houses,
	// restaurants,
	// players
	// );

	function FilterPreviewFiles(
		_tile: MapTileData
	): boolean {
		// if (mapType === "cropped") {
		// 	return (
		// 		tile.x >= props.xMin &&
		// 		tile.x <= xMax &&
		// 		tile.y >= yMin &&
		// 		tile.y <= yMax
		// 	);
		// }

		// Default is to allow through filter
		return true;
	}

	const returnDiv = useMemo((): JSX.Element => {
		return !map ? (
			<></>
		) : (
			<div
				className="map-preview-container"
				style={{
					gridTemplateColumns: `repeat(${map[0].length}, 1fr)`,
					aspectRatio: `${map[0].length} / ${map.length}`,
					...style
				}}
				{...args}
			>
				{/* TODO: Optimise the table rendering?? It seems a bit sluggish */}
				<table
					style={{
						// Fit the parent grid fully
						gridColumn: `1 / span ${map[0].length}`,
						gridRow: `1 / span ${map.length}`
					}}
				>
					<tbody>
						{...new Array(
							map[0].length / MAP_PIECE_WIDTH
						).fill(
							<tr>
								{...new Array(
									map.length /
										MAP_PIECE_HEIGHT
								).fill(<td />)}
							</tr>
						)}
					</tbody>
				</table>
				{/* <div
					className="map-preview-piece-overlay"
					style={{
						// Fit the parent grid fully
						gridColumn: `1 / span ${map[0].length}`,
						gridRow: `1 / span ${map.length}`,

						// Make the
						gridTemplateColumns: `repeat(${map[0].length / MAP_PIECE_WIDTH}, 100px)`,
						gridTemplateRows: `repeat(${map.length / MAP_PIECE_HEIGHT}, 100px)`
					}}
				>
					{new Array(
						((map[0].length / MAP_PIECE_WIDTH) *
							map.length) /
							MAP_PIECE_HEIGHT
					).fill(
						<div
							style={{
								width: "100%",
								height: "100%"
							}}
						/>
					)}
				</div> */}
				{/* Tiles */}
				{...map
					.flat(2)
					.filter(FilterPreviewFiles)
					.map((tile) => (
						<MapTile
							onClick={() => {
								mapObjectClicked({
									type: "TILE",
									data: tile
								});
							}}
							onMouseEnter={() => {
								mapObjectHovered({
									type: "TILE",
									data: tile
								});
							}}
							tile={tile}
						/>
					))}

				{/* Houses */}
				{...(houses ?? []).map((house) => (
					<House
						house={house}
						onClick={() => {
							mapObjectClicked({
								type: "HOUSE",
								data: house
							});
						}}
					/>
				))}

				{/* Restaurant */}
				{...restaurants.map((restaurant) => {
					const player = players?.find(
						(player) =>
							player.playerNumber ===
							restaurant.player
					);

					if (!player) return <></>;

					return (
						<RestaurantImage
							restaurantNumber={
								player.restaurant
							}
							style={{
								gridColumn: `${restaurant.x + 1} / span 2`,
								gridRow: `${restaurant.y + 1} / span 2`,
								width: "100%",
								height: "100%"
							}}
						/>
					);
				})}

				{/* Extras */}
				{...Array.from(
					Object.values(getAllRenderables)
				).flat(2)}

				{children}
			</div>
		);
	}, [
		map,
		houses,
		restaurants,
		players,
		getAllRenderables,
		mapObjectClicked,
		mapObjectHovered,
		style,
		args,
		children
	]);

	if (!map) return <></>;
	return returnDiv;
}

export default MagnateMap;
