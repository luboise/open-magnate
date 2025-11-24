import { Position } from "..";

export class Path {
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

export type PathNode = {
	pos: Position;
};
