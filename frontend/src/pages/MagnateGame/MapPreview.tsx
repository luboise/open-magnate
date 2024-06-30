import MapTile from "../../components/MapTile";
import { useGameState } from "../../hooks/useGameState";
import { MapTileData } from "../../utils";
import "./MapPreview.css";

type MapPreviewProps =
	| {
			type: "full";
	  }
	| {
			type: "cropped";
			xMin: number;
			xMax: number;
			yMin: number;
			yMax: number;
	  };

function MapPreview(props: MapPreviewProps) {
	const { mapRowOrder: map, houses } = useGameState();

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
			{...map
				.flat(2)
				.filter(FilterPreviewFiles)
				.map((tile) => <MapTile tile={tile} />)}
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
				>
					#{house.number}
				</div>
			))}
		</div>
	);
}

export default MapPreview;

