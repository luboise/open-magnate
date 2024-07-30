import "./EmployeeTree.css";

import {
	HTMLAttributes,
	useCallback,
	useEffect,
	useMemo,
	useReducer
} from "react";
import {
	EmployeeNode,
	GetAllTreeData,
	IsValidEmployeeTree,
	ParseEmployeeTree
} from "../../../../../shared/EmployeeStructure";
import Button from "../../../global_components/Button";
import { useGameState } from "../../../hooks/game/useGameState";
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

type EmployeeTreeState = {
	tree: EmployeeNode | null;
};

type EmployeeTreeAction =
	| {
			type: "ADD_NODE";
			parentEmployeeIndex: number;
			newNodeEmployeeIndex: number;
			indexInNewParent: number;
	  }
	| {
			type: "SET_TREE";
			tree: EmployeeNode | null;
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

function findParentNode(
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
	const { myEmployees, playerData } = useGameState();

	const { startPanning, offset, resetOffset } =
		usePanning("employee-tree", "RIGHT");

	const [employeeTree, dispatch] = useReducer(
		(
			state: EmployeeTreeState,
			action: EmployeeTreeAction
		): EmployeeTreeState => {
			switch (action.type) {
				case "SET_TREE":
					return { ...state, tree: action.tree };
				case "ADD_NODE":
					const {
						parentEmployeeIndex,
						newNodeEmployeeIndex,
						indexInNewParent
					} = action;

					if (!state.tree) {
						console.debug(
							"Attempted to add node to a null tree. Dismissing the action."
						);

						return state;
					}

					try {
						// Find the new parent node
						const newParentNode =
							findEmployeeRecursive(
								state.tree,
								parentEmployeeIndex
							);

						if (!newParentNode)
							throw new Error(
								"Attempting to add from invalid node."
							);

						// Check valid index
						if (
							indexInNewParent >=
								newParentNode.children
									.length ||
							indexInNewParent < 0
						)
							throw new Error(
								"Invalid index provided for updating the tree."
							);

						const newState: EmployeeTreeState =
							{
								...state
							};

						const newEmployee =
							myEmployees[
								newNodeEmployeeIndex
							];

						const hasCapacity =
							newEmployee.type ===
							"MANAGEMENT";

						const newNode: EmployeeNode = {
							data: newNodeEmployeeIndex,
							children: hasCapacity
								? new Array(
										newEmployee.capacity
									).fill(null)
								: []
						};

						if (
							newParentNode.children[
								indexInNewParent
							]
						) {
							console.debug(
								"Replacing child at index ",
								indexInNewParent,
								" with new child: ",
								newNode.data
							);
						}

						// See if the child already exists in the tree
						const oldParentData =
							findParentNode(
								state.tree,
								newNodeEmployeeIndex
							);

						// Remove it if its already in the tree
						if (oldParentData) {
							const [
								oldParentNode,
								indexInOldParent
							] = oldParentData;

							oldParentNode.children[
								indexInOldParent
							] = null;
						}

						// TODO: Add index validation for inserting into the parent
						newParentNode.children[
							indexInNewParent
						] = newNode;

						console.debug(
							"NEW EMPLOYEE: ",
							newEmployee,
							"NEW NODE: ",
							newNode
						);

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
			tree: null
		}
	);

	const onCardDropped =
		useCallback<EmployeeTreeAfterDropCallback>(
			(employeeDropped, dropDetails) => {
				if (!employeeTree.tree) return;

				const parent = findEmployeeRecursive(
					employeeTree.tree,
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

				dispatch({
					type: "ADD_NODE",
					parentEmployeeIndex: parent.data,
					newNodeEmployeeIndex:
						Number(employeeDropped),
					indexInNewParent: index
				});
			},
			[employeeTree]
		);

	const { spreadIfDrag, spreadIfDrop } = useDragDrop({
		afterDrop: onCardDropped
	});

	function resetTree() {
		resetOffset;

		dispatch({
			type: "SET_TREE",
			tree: ParseEmployeeTree(
				DEFAULT_SERIALISED_EMPLOYEE_STRING
			)
		});
	}

	const nodesInUse = useMemo(() => {
		console.debug("Calculating nodes in use");
		return employeeTree && employeeTree.tree
			? GetAllTreeData(employeeTree.tree)
			: [];
	}, [employeeTree, employeeTree.tree]);

	const treeHasMoved = offset.x !== 0 || offset.y !== 0;

	useEffect(() => {
		if (!playerData) return;

		const treeStr = playerData.employeeTreeStr;
		if (treeStr === undefined) return;
		// else if (treeStr === null)
		// dispatch({ type: "SET_TREE", tree: null });

		const newTree = ParseEmployeeTree(treeStr);

		if (
			newTree &&
			!IsValidEmployeeTree(newTree, myEmployees)
		) {
			console.debug(
				"Invalid employee tree. Resetting player's tree."
			);
			resetTree();
			return;
		}

		if (employeeTree.tree) {
			console.debug(
				"A tree already exists. Not updating.",
				"Old tree: ",
				employeeTree.tree,
				"New tree: ",
				newTree
			);

			return;
		}
		dispatch({ type: "SET_TREE", tree: newTree });
	}, [playerData?.employeeTreeStr]);

	if (!myEmployees || !employeeTree.tree) return <></>;

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
				{employeeTree.tree ? (
					<EmployeeTreeNode
						node={employeeTree.tree}
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
