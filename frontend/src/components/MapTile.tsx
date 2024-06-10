import { MapTileData, MapTileType } from "../game";
import "./MapTile.css";

function MapTile(props: { tileData: MapTileData }) {
	if (!props.tileData) return <p>invalid map tile</p>;

	const image: JSX.Element =
		props.tileData.type === MapTileType.EMPTY ? (
			<></>
		) : (
			<img
				src={`/resources/${props.tileData.type}.png`}
			/>
		);

	return <div className="map-tile">{image}</div>;
}

export default MapTile;
