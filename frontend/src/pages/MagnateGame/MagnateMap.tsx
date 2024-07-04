import { PropsWithChildren } from "react";
import MapTile from "../../components/MapTile";
import RestaurantImage from "../../components/RestaurantImage";
import { useGameState } from "../../hooks/useGameState";
import useMap from "../../hooks/useMap";
import { MapTileData } from "../../utils";
import "./MagnateMap.css";

type BaseMapProps = {
	onTileClicked?: (tile: MapTileData) => void;
};
type MapProps = BaseMapProps &
	(
		| {
				type: "full";
		  }
		| {
				type: "cropped";
				xMin: number;
				xMax: number;
				yMin: number;
				yMax: number;
		  }
	);

function MagnateMap(props: PropsWithChildren<MapProps>) {
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

	if (!map) return <></>;

	function FilterPreviewFiles(
		tile: MapTileData
	): boolean {
		if (props.type === "cropped") {
			return (
				tile.x >= props.xMin &&
				tile.x <= props.xMax &&
				tile.y >= props.yMin &&
				tile.y <= props.yMax
			);
		}
		// Default is to allow through filter
		return true;
	}

	return (
		<div
			className="map-preview-container"
			style={{
				gridTemplateColumns: `repeat(${map[0].length}, 1fr)`,
				aspectRatio: `${map[0].length} / ${map.length}`
			}}
		>
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
				<div
					style={{
						gridColumn: `${house.x + 1} / span 2`,
						gridRow: `${house.y + 1} / span 2`,
						backgroundColor: "pink",
						color: "white",
						border: "1px solid black",
						width: "100%",
						height: "100%",
						textAlign: "center",
						lineHeight: "10px",
						fontSize: "10px",
						zIndex: 2
					}}
					onClick={() => {
						mapObjectClicked({
							type: "HOUSE",
							data: house
						});
					}}
				>
					#{house.priority}
				</div>
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
						restaurantNumber={player.restaurant}
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

			{props.children}
		</div>
	);
}

export default MagnateMap;
