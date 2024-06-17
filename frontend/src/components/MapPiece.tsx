import { MapPieceData } from "../game";

import MapTile from "./MapTile";
import "./MapTile.css";

function MapPiece(props: { piece: MapPieceData }) {
	if (!props.piece) return <p>invalid map tile</p>;

	const rows = props.piece.tiles.map((row) => (
		<>
			{...row.map((tileData) => (
				<MapTile tile={tileData} />
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

export default MapPiece;
