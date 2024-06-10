import { MapPiece } from "../game";

function MapTile(props: { piece: MapPiece }) {
	if (!props.piece) return <p>invalid map tile</p>;

	return <div className="map-tile">{props.piece}</div>;
}

export default MapTile;
