import { Position } from "../../../backend/src/dataViews";
import { Map2D } from "../../map/map_2d/types";
import { DijkstraPriorityQueue } from "./dijkstra";
import { Path } from "./Path";

export function FindPath(
	map: Map2D,
	pos1: Position,
	pos2: Position
): Path | null {
	const node = new DijkstraPriorityQueue(map, pos1, pos2);
	return node.solve();
}

export * from "./dijkstra";
export * from "./Path";
