import { RoadAdjacencyType, TileType } from "../game";
import { MapTileData } from "../utils";
import "./MapTile.css";

function MapTile(props: { tile: MapTileData }) {
	if (!props.tile) return <p>invalid map tile</p>;

	const elements: JSX.Element[] = [];

	// Check if has valid image
	if (props.tile.type !== TileType.EMPTY) {
		elements.push(
			<img
				src={`/resources/${props.tile.type}.png`}
			/>
		);
	}

	if (props.tile.type === TileType.ROAD) {
		const roadData = props.tile
			.data as RoadAdjacencyType;

		if (!roadData) {
			throw new Error(
				`No road data specified for map of type "${TileType.ROAD}"`
			);
		}

		if (roadData.north)
			elements.push(
				<img
					className="mixin-image"
					src={`/resources/roadlinesnorth.png`}
				/>
			);

		if (roadData.east)
			elements.push(
				<img
					className="mixin-image"
					src={`/resources/roadlinesnorth.png`}
					style={{ transform: "rotate(90deg)" }}
				/>
			);

		if (roadData.south)
			elements.push(
				<img
					className="mixin-image"
					src={`/resources/roadlinesnorth.png`}
					style={{ transform: "rotate(180deg)" }}
				/>
			);

		if (roadData.west)
			elements.push(
				<img
					className="mixin-image"
					src={`/resources/roadlinesnorth.png`}
					style={{ transform: "rotate(270deg)" }}
				/>
			);
	}

	return <div className="map-tile">{...elements}</div>;
}

export default MapTile;
