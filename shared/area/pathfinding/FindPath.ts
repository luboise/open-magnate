import { Position } from "../../../backend/src/dataViews";
import { Map2D } from "../../map";
import {
	DijkstraPriorityQueue,
	PathDetails
} from "./dijkstra";

export function FindPath(
	map: Map2D,
	pos1: Position,
	pos2: Position
): PathDetails | null {
	const node = new DijkstraPriorityQueue(map, pos1, pos2);
	return node.solve();
}
