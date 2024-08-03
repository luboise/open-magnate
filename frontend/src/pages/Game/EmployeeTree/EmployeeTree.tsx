import "./EmployeeTree.css";

import {
	HTMLAttributes,
	useCallback,
	useEffect,
	useMemo
} from "react";
import {
	EmployeeNode,
	GetAllTreeData,
	IsValidEmployeeTree,
	ParseEmployeeTree
} from "../../../../../shared/EmployeeStructure";
import Button from "../../../global_components/Button";
import { useGameStateView } from "../../../hooks/game/useGameState";
import useTreePlanning from "../../../hooks/game/useTreePlanning";
import useDragDrop, {
	AfterDropCallback,
	SpreadIfDragFunction,
	SpreadIfDropFunction
} from "../../../hooks/useDragDrop";
import usePanning from "../../../hooks/usePanning";
import { DEFAULT_SERIALISED_EMPLOYEE_STRING } from "../../../utils";
import EmployeeCard from "../Employees/EmployeeCard";
import EmployeeTreeNode, {
	EmployeeTreeNodeDropDetails
} from "./EmployeeTreeNode";

export function findEmployeeRecursive(
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

export function findParentNode(
	root: EmployeeNode,
	toFind: number
): [EmployeeNode, number] | null {
	for (let i = 0; i < root.children.length; i++) {
		const child = root.children[i];

		if (!child) continue;

		if (child.data === toFind) return [root, i];

		const foundParent = findParentNode(child, toFind);
		if (foundParent !== null) return foundParent;
	}

	return null;
}

interface EmployeeTreeProps
	extends HTMLAttributes<HTMLDivElement> {}

type dd = number;
type rd = EmployeeTreeNodeDropDetails;

export type EmployeeTreeAfterDropCallback =
	AfterDropCallback<dd, rd>;

export type EmployeeTreeSpreadIfDragCallback =
	SpreadIfDragFunction<dd>;
export type EmployeeTreeSpreadIfDropCallback =
	SpreadIfDropFunction<rd>;

function EmployeeTree({ ...args }: EmployeeTreeProps) {
	const { myEmployees, playerData } = useGameStateView();

	const { startPanning, offset, resetOffset } =
		usePanning("employee-tree", "RIGHT");

	const { plannedTree, addNode, setTree } =
		useTreePlanning();

	// const {
	// 	parentEmployeeIndex,
	// 	newNodeEmployeeIndex,
	// 	indexInNewParent
	// } = action;

	// addNode(
	// 	parentEmployeeIndex,
	// 	newNodeEmployeeIndex,
	// 	indexInNewParent
	// );

	const onCardDropped =
		useCallback<EmployeeTreeAfterDropCallback>(
			(employeeDropped, dropDetails) => {
				if (!plannedTree) return;

				const parent = findEmployeeRecursive(
					plannedTree,
					dropDetails.parentReceiving
				);

				if (!parent)
					throw new Error(
						`Unable to find parent of dropped card ${employeeDropped}. It was dropped onto ${dropDetails.parentReceiving}.`
					);

				const index = dropDetails.indexInParent;

				if (
					index >= parent.children.length ||
					index < 0
				)
					throw new Error(
						"Invalid index provided for updating the tree: " +
							index
					);
				console.debug(
					`Card dropped on employee tree: parent: ${parent.data}, child: ${employeeDropped}, index: ${index}`
				);

				addNode(
					parent.data,
					Number(employeeDropped),
					index
				);
			},
			[plannedTree, myEmployees]
		);

	const { spreadIfDrag, spreadIfDrop } = useDragDrop({
		afterDrop: onCardDropped
	});

	function resetTree() {
		resetOffset;

		const defaultTree = ParseEmployeeTree(
			DEFAULT_SERIALISED_EMPLOYEE_STRING
		);

		if (!defaultTree)
			throw new Error("Failed to get default tree.");

		setTree(defaultTree);
	}

	const nodesInUse = useMemo(() => {
		console.debug("Calculating nodes in use");
		return plannedTree
			? GetAllTreeData(plannedTree)
			: [];
	}, [plannedTree]);

	const treeHasMoved = offset.x !== 0 || offset.y !== 0;

	useEffect(() => {
		if (!playerData) return;

		const treeStr = playerData.employeeTreeStr;
		if (!treeStr) return;
		// else if (treeStr === null)
		// dispatch({ type: "SET_TREE", tree: null });

		const newTree = ParseEmployeeTree(treeStr);

		if (!newTree || (newTree && !IsValidEmployeeTree)) {
			resetTree();
			return;
		}

		// if (plannedTree) {
		// 	console.debug(
		// 		"A tree already exists. Not updating.",
		// 		"Old tree: ",
		// 		plannedTree,
		// 		"New tree: ",
		// 		newTree
		// 	);

		// 	return;
		// }

		setTree(newTree);
	}, [playerData?.employeeTreeStr]);

	if (!myEmployees || !plannedTree) return <></>;

	return (
		<div className="game-employee-tree" {...args}>
			{treeHasMoved ? (
				<Button
					onClick={resetOffset}
					className="corner-button"
				>
					Reset View
				</Button>
			) : (
				<></>
			)}

			<div
				className="game-employee-tree-content"
				onMouseDown={startPanning}
			>
				{plannedTree ? (
					<EmployeeTreeNode
						node={plannedTree}
						employeeList={myEmployees}
						style={{
							transform: `translate(${offset.x}px, ${offset.y}px)`
						}}
						// dropCallback={onCardDropped}
						spreadIfDrag={spreadIfDrag}
						spreadIfDrop={spreadIfDrop}
					/>
				) : (
					<></>
				)}
			</div>
			<div className="game-employee-tree-cards">
				{...myEmployees.map(
					(employee, index): JSX.Element => {
						if (
							!employee ||
							nodesInUse.includes(index)
						)
							return <></>;

						return (
							<EmployeeCard
								employee={employee}
								{...spreadIfDrag(index)}
							/>
						);
					}
				)}
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

