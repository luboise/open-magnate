import { MapPiece } from "../game";
import "./MapTile.css";

function MapTile(props: { piece: MapPiece }) {
	if (!props.piece) return <p>invalid map tile</p>;

	const rows = props.piece.map((row) => (
		<>
			{...row.map((tile) => (
				<div className="map-tile">{tile.type}</div>
			))}
		</>
	));

	return (
		<>
			<div className="map-tile-wrapper">
				{...rows}
			</div>
		</>
	);
}

export default MapTile;
