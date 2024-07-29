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
	CardMakerCallbackType,
	ParentDetailsInterface,
	TreeNodeDropCallback
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

function EmployeeTree({ ...args }: EmployeeTreeProps) {
	const { myEmployees, playerData } = useGameState();

	const { startPanning, offset, resetOffset } =
		usePanning("employee-tree", "RIGHT");

	const [employeeTree, dispatch] = useReducer(
		(
			state: EmployeeTreeState,
			action: EmployeeTreeAction
		): EmployeeTreeState => {
			console.debug("ACTION: ", action);
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
		(parentIndex, newEmployee, indexInParent) => {
			console.debug(
				`Card dropped on employee tree: parent: ${parentIndex}, child: ${newEmployee}, index: ${indexInParent}`
			);

			dispatch({
				type: "ADD_NODE",
				parentEmployeeIndex: parentIndex,
				newNodeEmployeeIndex: newEmployee,
				indexInNewParent: indexInParent
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
		console.debug("Started dragging: ", div);

		// div.style.position = "fixed";
	};

	const onDrag: DragEventHandler<HTMLDivElement> = (
		event
	) => {
		event.preventDefault();

		// console.debug("drag", event.screenX, event.screenY);

		// div.style.translate = `${event.clientX}px ${event.clientY}px`;
		// div.style.position = "fixed";
	};

	const onDragEnd: DragEventHandler<HTMLDivElement> = (
		_event
	) => {
		if (!element.current) {
			console.debug("Drag end: no element found");
			return;
		}

		styleDraggee(element.current, true);

		element.current = null;

		console.debug("drag end");
	};

	// const MakeDraggableEmployeeCard = useCallback(
	// 	(employee: Employee, index: number) => {
	// 		return (
	// 			<EmployeeCard
	// 				employee={employee}
	// 				draggable={true}
	// 				onDragStart={(event) => {
	// 					event.dataTransfer.setData(
	// 						"number",
	// 						String(index)
	// 					);
	// 					onDragStart(event);
	// 				}}
	// 				onDrag={onDrag}
	// 				onDragEnd={onDragEnd}
	// 				id={`employee-card-tree-${index}`}
	// 			/>
	// 		);
	// 	},
	// 	[onDrag, onDragEnd]
	// );

	// Always need to know
	// Who is the parent
	// What index am i in the parent
	// Which employee am i

	const MakeDraggableEmployeeCard =
		useCallback<CardMakerCallbackType>(
			({
				employeeDetails,

				dropTarget,
				dragTarget,
				parentDetails,
				employeeIndex
			}) => {
				if (employeeIndex !== 0 && !employeeIndex) {
					if (!parentDetails)
						throw new Error(
							`No employee provided (${employeeIndex})`
						);
					return (
						<div
							style={{
								width: 100,
								height: 100,
								backgroundColor: "red"
							}}
							{...(dropTarget
								? DropTargetProperties(
										parentDetails
									)
								: {})}
						/>
					);
				}

				return (
					<EmployeeCard
						employee={employeeDetails}
						{...(dragTarget
							? DragTargetProperties(
									employeeIndex
								)
							: {})}
						{...(dropTarget && parentDetails
							? DropTargetProperties(
									parentDetails
								)
							: {})}
					/>
				);
			},
			[onDrag, onDragEnd]
		);

	// Want to know who was dragged
	const DragTargetProperties = (
		employeeDragged: number
	): HTMLAttributes<HTMLDivElement> => {
		if (employeeDragged !== 0 && !employeeDragged)
			throw new Error(
				`Invalid employee dragged: ${employeeDragged}`
			);
		return {
			draggable: true,
			onDragStart: (event) => {
				event.dataTransfer.setData(
					"number",
					String(employeeDragged)
				);
				onDragStart(event);
			},
			onDrag: onDrag,

			onDragEnd: onDragEnd
		};
	};

	// Want to know the parent of the receiver, and where i am in relation to them
	const DropTargetProperties = (
		parentDetails: ParentDetailsInterface
	): HTMLAttributes<HTMLDivElement> => {
		const { parentNode, indexInParent } = parentDetails;
		const parentEmployee = parentNode.data;

		return {
			onDragEnter: (event) => {
				event.preventDefault();
				console.debug("Enter");
			},
			onDragOver: (e) => e.preventDefault(),
			onDrop: (event) => {
				// event.preventDefault();
				console.debug(
					`Parent employee ${parentEmployee} received a drop at child ${indexInParent}`
				);

				const employeeDragged = Number(
					event.dataTransfer.getData("number")
				);

				if (!employeeDragged)
					throw new Error(
						`Invalid employee dragged: ${employeeDragged}`
					);

				onCardDropped(
					parentEmployee,
					employeeDragged,
					indexInParent
				);
			}
		};
	};

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
						cardMakerCallback={
							MakeDraggableEmployeeCard
						}
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

						// TODO: Fix parent index
						return MakeDraggableEmployeeCard({
							employeeDetails: employee,
							parentEmployeeIndex: -1,
							parentDetails: {
								indexInParent: index,
								parentNode:
									employeeTree.tree
							},
							dragTarget: true,
							dropTarget: false
						});
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

