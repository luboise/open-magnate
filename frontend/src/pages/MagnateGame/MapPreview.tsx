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
	const { map } = useGameState();

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
		<div className="map-preview-container">
			{map.map((line) => (
				<div className="map-tile-row">
					{line
						.filter(FilterPreviewFiles)
						.map((tile) => (
							<MapTile tile={tile} />
						))}
				</div>
			))}
		</div>
	);
}

export default MapPreview;
