import "./EmployeeTree.css";

import {
	DragEventHandler,
	HTMLAttributes,
	useCallback,
	useEffect,
	useReducer,
	useRef
} from "react";
import {
	EmployeeNode,
	GetAllTreeData,
	IsValidEmployeeTree,
	ParseEmployeeTree
} from "../../../../../shared/EmployeeStructure";
import Button from "../../../global_components/Button";
import { useGameState } from "../../../hooks/useGameState";
import usePanning from "../../../hooks/usePanning";
import { DEFAULT_SERIALISED_EMPLOYEE_STRING } from "../../../utils";
import EmployeeCard from "./EmployeeCard";
import EmployeeTreeNode, {
	TreeNodeDropCallback
} from "./EmployeeTreeNode";

type EmployeeTreeState = {
	tree: EmployeeNode | null;
};

type EmployeeTreeAction =
	| {
			type: "ADD_NODE";
			parent: number;
			newChild: number;
			parentIndex: number;
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

interface EmployeeTreeProps
	extends HTMLAttributes<HTMLDivElement> {}

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
						parent,
						newChild: childEmployeeIndex,
						parentIndex
					} = action;

					if (!state.tree) {
						console.debug(
							"Attempted to add node a null tree. Dismissing the action."
						);

						return state;
					}

					try {
						// Find the parent node
						const node = findEmployeeRecursive(
							state.tree,
							parent
						);

						if (!node)
							throw new Error(
								"Attempting to add from invalid node."
							);

						// Check valid index
						if (
							parentIndex >=
								node.children.length ||
							parentIndex < 0
						)
							throw new Error(
								"Invalid index provided for updating the tree."
							);

						// Check that there isn't already a child at that index
						if (node.children[parentIndex])
							return state;

						const newState: EmployeeTreeState =
							{
								...state
							};

						const newEmployee =
							myEmployees[childEmployeeIndex];
						const hasCapacity =
							newEmployee.type ===
							"MANAGEMENT";

						const newNode: EmployeeNode = {
							data: childEmployeeIndex,
							children: hasCapacity
								? new Array(
										newEmployee.capacity
									).fill(null)
								: []
						};

						// TODO: Add index validation for inserting into the parent
						node.children[parentIndex] =
							newNode;

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

	function resetTree() {
		resetOffset;

		dispatch({
			type: "SET_TREE",
			tree: ParseEmployeeTree(
				DEFAULT_SERIALISED_EMPLOYEE_STRING
			)
		});
	}

	const element = useRef<HTMLDivElement | null>(null);

	const nodesInUse = employeeTree.tree
		? GetAllTreeData(employeeTree.tree)
		: [];

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

	const onCardDropped = useCallback<TreeNodeDropCallback>(
		(parent, child, index) => {
			console.debug(
				"Card dropped on employee tree: ",
				child,
				parent,
				index
			);

			dispatch({
				type: "ADD_NODE",
				parent: parent,
				newChild: child,
				parentIndex: index
			});
		},
		[]
	);

	function styleDraggee(
		_element: HTMLElement,
		_revert: boolean = false
	) {}

	const onDragStart: DragEventHandler<HTMLDivElement> = (
		event
	) => {
		// event.preventDefault();

		// alert(`Drag event: ${id}`);

		const div = event.target as HTMLDivElement;

		// if (!(div instanceof HTMLDivElement)) {
		// 	console.debug("Drag event: not a div");
		// 	return;
		// }

		// event.dataTransfer.setData("text/plain", div.id);
		event.dataTransfer.setDragImage(
			div,
			div.clientWidth / 2,
			div.clientHeight / 2
		);

		element.current = div;

		styleDraggee(element.current, true);

		// div.style.position = "fixed";
	};

	const onDrag: DragEventHandler<HTMLDivElement> = (
		event
	) => {
		event.preventDefault();

		console.debug("drag", event.screenX, event.screenY);

		// div.style.translate = `${event.clientX}px ${event.clientY}px`;
		// div.style.position = "fixed";
	};

	const onDragEnd: DragEventHandler<HTMLDivElement> = (
		_event
	) => {
		if (!element.current) {
			return;
		}

		styleDraggee(element.current, true);

		element.current = null;

		console.debug("drag end");
	};

	return (
		<div
			className="game-employee-tree-section"
			{...args}
		>
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
						dropCallback={onCardDropped}
					/>
				) : (
					<></>
				)}
			</div>
			<div className="game-employee-tree-cards">
				{...myEmployees.map((employee, index) => {
					if (nodesInUse.includes(index))
						return <></>;

					return (
						<EmployeeCard
							employee={employee}
							draggable={true}
							onDragStart={(event) => {
								event.dataTransfer.setData(
									"number",
									String(index)
								);
								onDragStart(event);
							}}
							onDrag={onDrag}
							onDragEnd={onDragEnd}
							id={`employee-card-tree-${index}`}
						/>
					);
				})}
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

