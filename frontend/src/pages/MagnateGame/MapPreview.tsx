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
	const { mapRowOrder: map } = useGameState();

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
		</div>
	);
}

export default MapPreview;

