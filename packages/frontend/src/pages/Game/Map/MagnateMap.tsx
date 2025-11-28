import "./MagnateMap.css";

import { HTMLAttributes, PropsWithChildren } from "react";

import House from "./House";
import GameMapTile from "./Tiles/GameMapTile";
import GameRoadTile from "./Tiles/GameRoadTile";
import useMap from "../../../hooks/game/useMap";
import useGameStateView from "../../../hooks/game/useGameStateView";
import { GameMap, MapTile, Position, MAP_PIECE_WIDTH, MAP_PIECE_HEIGHT, HouseTile } from "magnate-core";
import MapRestaurantTile from "./Tiles/MapRestaurantTile";

interface MapProps extends HTMLAttributes<HTMLDivElement> {
	gameMap: GameMap
}

function MagnateMap({
	children,
	gameMap,
	style,
	...args
}: PropsWithChildren<MapProps>) {
	// console.debug("Rendering magnate map.");

	const {
		sendMapHoveredEvent
	} = useMap();

	const { gameState } = useGameStateView();


	/*
	const {
		mapRowOrder: map,
		houses,
		restaurants,
		players,
		marketingCampaigns
	} = useGameStateView();
	*/

	// const { nowHovering } = useMapTileInteraction();

	// console.debug(
	// "Rendering magnate map.",
	// map,
	// houses,
	// restaurants,
	// players
	// );

	function FilterPreviewFiles(
		_tile: MapTile
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

	const mapWidth = gameMap.width;
	const mapHeight = gameMap.height;


	return (
		<div
			className="map-preview-container"
			style={{
				gridTemplateColumns: `repeat(${mapWidth}, 1fr)`,
				aspectRatio: `${mapHeight} / ${mapHeight}`,
				...style
			}}
			{...args}
			onMouseLeave={() => { } /*nowHovering(null)*/}
			onMouseMove={(e) => {
				const rect = e.currentTarget.getBoundingClientRect();

				const x = (e.clientX - rect.left) / rect.width;
				const y = (e.clientY - rect.top) / rect.height;

				// const pos = Position(Math.floor(x * gameState!.map.width), Math.floor(y * gameState!.map.height));
				const pos = Position(Math.floor(-0.5 + x * gameState!.map.width), Math.floor(-0.5 + y * gameState!.map.height));

				sendMapHoveredEvent(pos, true);
			}}
		>
			{/* TODO: Optimise the table rendering?? It seems a bit sluggish */}
			<table
				style={{
					// Fit the parent grid fully
					gridColumn: `1 / span ${mapWidth}`,
					gridRow: `1 / span ${mapHeight}`
				}}
			>
				<tbody>
					{...new Array(
						mapWidth / MAP_PIECE_WIDTH
					).fill(
						<tr>
							{...new Array(
								mapHeight /
								MAP_PIECE_HEIGHT
							).fill(<td />)}
						</tr>
					)}
				</tbody>
			</table>



			{/* Tiles */}
			{...gameMap.tiles
				.filter(FilterPreviewFiles)
				.map((tile) => {
					switch (tile.tileType) {
						case "HOUSE": {
							return <House house={tile as HouseTile} />
						}
						case "DRINK": {
							return <GameMapTile tile={tile} />
						}
						case "ROAD": {
							return <GameRoadTile tile={tile} />
						}
						case "RESTAURANT": {
							return <MapRestaurantTile tile={tile} />
						}
					}
					return <></>;
				})}

			{
				/*
				...restaurants.map((restaurant) => {
				const player = players?.find(
					(player) =>
						player.playerNumber ===
						restaurant.player
				);

				if (!player) return <></>;

				return (
					<RestaurantImage
						restaurantNumber={player.restaurant}
						style={{
							gridColumn: `${restaurant.pos.x + 1} / span 2`,
							gridRow: `${restaurant.pos.y + 1} / span 2`,
							width: "100%",
							height: "100%"
						}}
					/>
				);
			})
			*/
			}

			{/*
				...marketingCampaigns.map((campaign) => {
				const mt =
					GetMarketingTileFromView(campaign);
				return (
					<MapMarketingTile
						snapToGrid={true}
						tile={mt}
					/>
				);
			})
			*/
			}

			{children}
		</div>
	);
}

export default MagnateMap;
