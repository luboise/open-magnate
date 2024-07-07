import "./EmployeeTree.css";

import { useReducer, useState } from "react";
import { Employee } from "../../../../../../../shared/EmployeeTypes";
import Button from "../../../../../components/Button";
import usePanning from "../../../../../hooks/usePanning";
import {
	EmployeesById,
	createCEOEmployee
} from "../../../../../utils";
import EmployeeCard from "./EmployeeCard";
import EmployeeTreeNode from "./EmployeeTreeNode";

// type TreeNode<T extends string | number | symbol> = Record<
// 	T,
// 	Array<TreeNode<T> | null>
// >;

type TreeNode<T> = {
	data: T;
	children: Array<TreeNode<T> | null>;
};

type EmployeeTreeState = {
	tree: TreeNode<number>;
};

type EmployeeTreeAction = {
	type: "ADD_NODE";
	from: number;
	to: number;
	atIndex: number;
};

function getAllData<T>(node: TreeNode<T>): Array<T> {
	let data: Array<T> = [node.data];

	for (const child of node.children) {
		if (child !== null) data.concat(getAllData(child));
	}

	return data;
}

function findEmployeeRecursive(
	node: TreeNode<number>,
	toFind: number
): TreeNode<number> | null {
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
	// const { myEmployees } = useGameState();

	const { rightMouseOffset } = usePanning(document.body);

	const [treeOffset, setTreeOffset] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });

	function resetTree() {
		setTreeOffset({ ...rightMouseOffset });
	}

	const myEmployees: Employee[] = [
		createCEOEmployee(3),
		EmployeesById["mgmt_1"],
		EmployeesById["mgmt_2"],
		EmployeesById["food_1"]
	];

	if (!myEmployees.length) return <></>;

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
			tree: { data: 0, children: [null, null, null] }
		}
	);

	const nodesInUse = getAllData(employeeTree.tree);

	const offset = {
		x: rightMouseOffset.x - treeOffset.x,
		y: rightMouseOffset.y - treeOffset.y
	};

	const treeHasChanged =
		rightMouseOffset.x !== treeOffset.x ||
		rightMouseOffset.y !== treeOffset.y;

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

			<div className="game-employee-tree-content">
				{...nodesInUse.map((node) => (
					<EmployeeTreeNode
						employee={myEmployees[node]}
						style={{
							position: "absolute",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							flex: 1,
							transform: `translate(${offset.x}px, ${
								offset.y
							}px)`
						}}
					/>
				))}
			</div>
			<div className="game-employee-tree-cards">
				{...myEmployees.map((employee) => (
					<EmployeeCard employee={employee} />
				))}
			</div>
		</div>
	);
}

export default EmployeeTree;
