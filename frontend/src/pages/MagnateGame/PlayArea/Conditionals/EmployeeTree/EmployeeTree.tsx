import "./EmployeeTree.css";

import { useMemo, useReducer, useState } from "react";
import {
	EmployeeNode,
	GetAllTreeData,
	ParseEmployeeTree
} from "../../../../../../../shared/EmployeeStructure";
import Button from "../../../../../components/Button";
import { useGameState } from "../../../../../hooks/useGameState";
import usePanning from "../../../../../hooks/usePanning";
import EmployeeCard from "./EmployeeCard";
import EmployeeTreeNode from "./EmployeeTreeNode";

type EmployeeTreeState = {
	tree: EmployeeNode | null;
};

type EmployeeTreeAction = {
	type: "ADD_NODE";
	from: number;
	to: number;
	atIndex: number;
};

function findEmployeeRecursive(
	node: EmployeeNode,
	toFind: number
): EmployeeNode | null {
	if (node.data === toFind) {
		return node;
	} else {
		for (const child of node.children) {
			if (!child) continue;

			const found = findEmployeeRecursive(
				child,
				toFind
			);
			if (found) {
				return found;
			}
		}
	}

	return null;
}

function EmployeeTree() {
	const { myEmployees, playerData } = useGameState();

	const { startRightPan, rightMouseOffset } =
		usePanning();

	const currentEmployeeTree = useMemo(() => {
		if (!playerData || !playerData.employeeTreeStr) {
			return null;
		}

		return ParseEmployeeTree(
			playerData.employeeTreeStr
		);
	}, [playerData?.employeeTreeStr]);

	const [treeOffset, setTreeOffset] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });

	const [employeeTree, dispatch] = useReducer(
		(
			state: EmployeeTreeState,
			action: EmployeeTreeAction
		): EmployeeTreeState => {
			if (action.type === "ADD_NODE") {
				try {
					const node = findEmployeeRecursive(
						state.tree,
						action.from
					);

					if (!node)
						throw new Error(
							"Attempting to add from invalid node."
						);

					if (
						action.atIndex >=
							node.children.length ||
						action.atIndex < 0
					)
						throw new Error(
							"Invalid index provided for updating the tree."
						);

					if (node.children[action.atIndex])
						throw new Error(
							"Attempted to place node over an existing node."
						);

					const newState: EmployeeTreeState = {
						...state
					};
					node.children[action.atIndex] = {
						data: action.to,
						children: [null, null, null]
					};

					return {
						...newState
					};
				} catch (error) {
					console.debug(error);
				}
			}
			return { ...state };
		},
		{
			// Index 0 is the CEO
			tree: currentEmployeeTree
		}
	);

	function resetTree() {
		setTreeOffset({ ...rightMouseOffset });
	}

	const nodesInUse = employeeTree.tree
		? GetAllTreeData(employeeTree.tree)
		: [];

	const offset = {
		x: rightMouseOffset.x - treeOffset.x,
		y: rightMouseOffset.y - treeOffset.y
	};

	const treeHasChanged =
		rightMouseOffset.x !== treeOffset.x ||
		rightMouseOffset.y !== treeOffset.y;

	// function makeEmployeeDivTree(startNode: EmployeeNode) {
	// 	const nodes: JSX.Element[] = [];

	// 		// <EmployeeTreeNode
	// 		// 	employee={myEmployees[startNode.data]}
	// 		// 	childSlots={startNode.children
	// 		// 		.filter((child) => child !== null)
	// 		// 		.map((child) => {
	// 		// 			return myEmployees[child!.data];
	// 		// 		})}
	// 		// style={{
	// 		// 	width: "20%",
	// 		// 	transform: `translate(${offset.x}px, ${offset.y}px)`
	// 		// }}
	// 		// />
	// 		();

	// 	return nodes;
	// }

	return (
		<div className="game-employee-tree-section">
			{treeHasChanged ? (
				<Button
					onClick={resetTree}
					className="game-employee-tree-reset-button"
				>
					Reset View
				</Button>
			) : (
				<></>
			)}

			<div
				className="game-employee-tree-content"
				onMouseDown={startRightPan}
			>
				{employeeTree.tree ? (
					<EmployeeTreeNode
						node={employeeTree.tree}
						employeeList={myEmployees}
						style={{
							transform: `translate(${offset.x}px, ${offset.y}px)`
						}}
					/>
				) : (
					<></>
				)}
			</div>
			<div className="game-employee-tree-cards">
				{...myEmployees
					.filter(
						(_, index) =>
							!nodesInUse.includes(index)
					)
					.map((employee) => (
						<EmployeeCard employee={employee} />
					))}
			</div>
		</div>
	);

	// style={{
	// 	position: "absolute",
	// 	display: "flex",
	// 	flexDirection: "column",
	// 	justifyContent: "center",
	// 	alignItems: "center",
	// 	flex: 1,
	// 	transform: `translate(${offset.x}px, ${
	// 		offset.y
	// 	}px)`
	// }}
}

export default EmployeeTree;
