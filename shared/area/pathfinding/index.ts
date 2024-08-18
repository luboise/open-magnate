import { Position } from "../../../backend/src/dataViews";
import { Map2D } from "../../MapData";

type PathNode = {
	pos: Position;
};

class Path {
	private nodes: PathNode[];

	constructor() {
		this.nodes = [];
	}

	addNode(pos: Position) {
		this.nodes.push({ pos: { ...pos } });
	}

	getLength(): number {
		return this.nodes.length;
	}

	getPath(): PathNode[] {
		return this.nodes.map((node) => ({
			...node,
			pos: { ...node.pos }
		}));
	}
}

interface PathSeeker {
	pos: Position;
	cost: number;
}

export function FindPath(
	map: Map2D,
	pos1: Position,
	pos2: Position
): Path {
	const currentPos = { ...pos1 };

	const visited = new Set<Position>({ ...currentPos });

	const currents: Position[] = { ...currentPos };
	while (currents.length > 0) {}
}

function _findPathRec(
	map: Map2D,
	seeker: PathSeeker,
	target: Position,
	visited: Set<Position>
): number | null {
	const costs = [
		[0, 1],
		[0, -1],
		[1, 0],
		[-1, 0]
	]
		.map((tuple) => {
			const oldPos: Position = seeker.pos;

			const newPos: Position = {
				x: seeker.pos.x + tuple[0],
				y: seeker.pos.y + tuple[1]
			};

			if (
				newPos.x < 0 ||
				newPos.x >= map.length ||
				newPos.y < 0 ||
				newPos.y >= map[0].length
			)
				return null;

			const newCost: number =
				seeker.cost +
				(oldPos.x % 5 === 0 ||
				newPos.x % 5 === 0 ||
				oldPos.y % 5 === 0 ||
				newPos.y % 5 === 0
					? 1
					: 0);

			const newSeeker: PathSeeker = {
				...seeker,
				pos: newPos,
				cost: newCost
			};

			if (visited.has(newPos)) {
			}

			return _findPathRec(map, target, visited);
		})
		.filter((val) => val !== null);

	if (costs.length === 0) return null;
	else return Math.min(...costs);
}
