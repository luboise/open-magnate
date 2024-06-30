import {
	DirectionBools,
	MapTileData,
	TileType
} from "../utils";
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
		const roadData = props.tile.data as DirectionBools;

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

	const classes = ["map-tile"];
	for (const direction of [
		"north",
		"south",
		"east",
		"west"
	]) {
		if (
			props.tile.pieceEdges[
				direction as keyof DirectionBools
			]
		)
			classes.push(`tile-boundary-${direction}`);
	}
	return (
		<div
			className={classes.join(" ")}
			style={{
				gridColumn: `${props.tile.x + 1}`,
				gridRow: `${props.tile.y + 1}`
			}}
		>
			{/* <div className="map-tile-content"> */}
			{...elements}
			{/* </div> */}
		</div>
	);
}

export default MapTile;
