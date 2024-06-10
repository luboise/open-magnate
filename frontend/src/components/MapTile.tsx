import { MapTileData } from "../game";
import "./MapTile.css";

function MapTile(props: { tileData: MapTileData }) {
	if (!props.tileData) return <p>invalid map tile</p>;

	return (
		<div className="map-tile">
			{props.tileData.type}
		</div>
	);
}

export default MapTile;
