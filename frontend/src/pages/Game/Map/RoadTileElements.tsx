import { useMemo } from "react";
import { DirectionBools, TileType } from "../../../utils";
import RoadLines from "./RoadLines";

interface RoadTileProps {
	roadDirections: DirectionBools;
}

function RoadTileElements({
	roadDirections
}: RoadTileProps) {
	if (!roadDirections)
		throw new Error(
			`No road data specified for map of type "${TileType.ROAD}"`
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

export default RoadTileElements;

