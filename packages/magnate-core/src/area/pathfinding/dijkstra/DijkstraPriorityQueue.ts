import { Area } from "../..";
import { Map2D } from "../../../map";
import { Position } from "../../Units";
import { Path } from "../Path";

interface DijkstraNode {
	from: Position;

	pos: Position;
	cost: number;
}

export function serialisePosition(pos: Position): string {
	return `${pos.x},${pos.y}`;
}

export class DijkstraPriorityQueue {
	private map: Map2D;
	private start: Position;
	private end: Position;

	private visited: DijkstraNode[] = [];
	private available: DijkstraNode[] = [];

	constructor(
		map: Map2D,
		start: Position,
		end: Position
	) {
		this.map = map;
		this.start = start;
		this.end = end;

		this.visitNode({
			from: start,
			pos: start,
			cost: 0
		});

		this.addNeighbours({
			cost: 0,
			from: start,
			pos: start
		});
	}

	private posIsAvailable(pos: Position): boolean {
		return (
			this.available.find(
				(node) =>
					node.pos.x === pos.x &&
					node.pos.y === pos.y
			) === undefined
		);
	}

	private updateAvailableNode(
		pos: Position,
		newFrom: DijkstraNode,
		newCost: number
	) {
		const availableNode = this.available.find(
			(node) =>
				node.pos.x === pos.x && node.pos.y === pos.y
		);
		if (!availableNode)
			throw new Error(
				"Attempted to update an available node that isn't actually available."
			);

		if (newCost < availableNode.cost) {
			availableNode.from = newFrom.pos;
			availableNode.cost = newCost;
		}
	}

	private canTraverse(pos: Position): boolean {
		if (!Area.IsInBounds(this.map, pos)) return false;

		if (
			!(
				pos.x === this.end.x && pos.y === this.end.y
			) &&
			this.map[pos.x][pos.y].tileType !== "ROAD"
		)
			return false;

		if (
			this.visited.some(
				(node) =>
					node.pos.x === pos.x &&
					node.pos.y === pos.y
			)
		)
			return false;

		return true;
	}

	private addNeighbours(node: DijkstraNode) {
		for (const direction of [
			[-1, 0],
			[1, 0],
			[0, -1],
			[0, 1]
		]) {
			const newPos = {
				x: node.pos.x + direction[0],
				y: node.pos.y + direction[1]
			};

			if (!this.canTraverse(newPos)) continue;

			const costDiff = Area.CrossedTileBorder(
				node.pos,
				newPos
			)
				? 1
				: 0;

			const newCost = node.cost + costDiff;
			const newNode = {
				pos: newPos,
				from: node.pos,
				cost: newCost
			};

			if (!this.posIsAvailable(newPos)) {
				this.updateAvailableNode(
					newPos,
					node,
					newCost
				);
				return;
			} else {
				this.available.push(newNode);
			}
		}
	}

	private visitNode(newNode: DijkstraNode) {
		const visitedNodeIndex = this.visited.findIndex(
			(node) =>
				node.pos.x === newNode.pos.x &&
				node.pos.y === newNode.pos.y
		);
		if (visitedNodeIndex !== -1) {
			throw new Error(
				"Attempted to visit node that has already been visited."
			);
		}

		this.visited.push(newNode);
		this.addNeighbours(newNode);
		// Otherwise if the node is new, add it to the queue
	}

	private visit(): DijkstraNode | null {
		if (this.available.length === 0) return null;

		this.available.sort((a, b) => a.cost - b.cost);
		const node = this.available.shift();
		if (!node) return null;

		if (
			!(
				node.pos.x === this.end.x &&
				node.pos.y === this.end.y
			)
		) {
			this.visitNode(node);
		}

		return node;
	}

	public solve(): PathDetails | null {
		let finalNode = this.visit();
		while (
			finalNode !== null &&
			!(
				finalNode.pos.x === this.end.x &&
				finalNode.pos.y === this.end.y
			)
		) {
			finalNode = this.visit();
		}

		if (finalNode === null) return null;

		const finalCost = finalNode.cost;

		const path: Path = new Path();
		while (
			finalNode &&
			!(
				finalNode.from.x === this.start.x &&
				finalNode.from.y === this.start.y
			)
		) {
			path.addNode(finalNode.pos);
			finalNode =
				this.visited.find(
					(node) =>
						node.pos.x === finalNode!.from.x &&
						node.pos.y === finalNode!.from.y
				) ?? null;
		}
		path.addNode(this.start);

		const pathDetails: PathDetails = {
			path: path,
			cost: finalCost
		};

		return pathDetails;
	}
}

export interface PathDetails {
	path: Path;
	cost: number;
}
