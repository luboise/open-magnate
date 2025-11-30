import { RoadTile, DirectionSet } from "magnate-core";
import RoadLines from "./RoadLines";
import { useMemo } from "react";

interface RoadTileProps {
	tile: RoadTile;
	directions: DirectionSet
}

function RoadTileElements(
	roadDirections: DirectionSet) {
	if (!roadDirections)
		throw new Error(
			`No road data specified for map of type "${"ROAD"}"`
		);

	const elements = useMemo((): JSX.Element[] => {
		const elements = [];

		if (roadDirections.north)
			elements.push(<RoadLines rotation="NORTH" />);

		if (roadDirections.east)
			elements.push(<RoadLines rotation="EAST" />);

		if (roadDirections.south)
			elements.push(<RoadLines rotation="SOUTH" />);

		if (roadDirections.west)
			elements.push(<RoadLines rotation="WEST" />);

		return elements;
	}, [
		roadDirections.north,
		roadDirections.east,
		roadDirections.south,
		roadDirections.west
	]);

	return <>{...elements}</>;
}



function GameRoadTile({ tile, directions }: RoadTileProps) {
	if (!tile) return <p>invalid map tile</p>;

	const elements = RoadTileElements(directions);

	return (<div
		className={"map-tile map-tile-road"}
		style={{
			gridColumn: `${tile.position.x + 1}`,
			gridRow: `${tile.position.y + 1}`
		}}
	>
		{/* <div className="map-tile-content"> */}
		{elements}
		{/* </div> */}
	</div>);

}

export default GameRoadTile
