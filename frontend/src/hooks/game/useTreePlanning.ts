import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";
import {
	findEmployeeRecursive,
	findParentNode
} from "../../pages/Game/EmployeeTree/EmployeeTree";
import {
	EmployeeNode,
	IsValidEmployeeTree
} from "../../utils";
import { useGameStateView } from "./useGameState";

const treePlanningAtom = atom<EmployeeNode>({
	key: "treePlanningAtom",
	// TODO: Fix this to work with different CEO sizes past bank break
	default: {
		data: 0,
		children: [null, null, null]
	}
});

function useTreePlanning() {
	const { myEmployees } = useGameStateView();

	const [plannedTree, setPlannedTree] = useRecoilState(
		treePlanningAtom
	);

	const { playerData } = useGameStateView();
	if (!playerData)
		throw new Error("No player data available");

	const setTree = useCallback(
		(newTree: EmployeeNode) => {
			if (!IsValidEmployeeTree(newTree, myEmployees))
				throw new Error(
					"Attempted to set tree to invalid tree."
				);

			setPlannedTree(newTree);
		},
		[plannedTree, myEmployees]
	);

	const addNode = useCallback(
		(
			parentEmployeeIndex: number,
			newNodeEmployeeIndex: number,
			indexInNewParent: number
		) => {
			try {
				const treeClone: EmployeeNode = JSON.parse(
					JSON.stringify(plannedTree)
				);

				// Find the new parent node
				const newParentNode = findEmployeeRecursive(
					treeClone,
					parentEmployeeIndex
				);

				if (!newParentNode)
					throw new Error(
						"Attempting to add from invalid node."
					);

				// Check valid index
				if (
					indexInNewParent >=
						newParentNode.children.length ||
					indexInNewParent < 0
				)
					throw new Error(
						"Invalid index provided for updating the tree."
					);

				const newEmployee =
					myEmployees[newNodeEmployeeIndex];

				const hasCapacity =
					newEmployee.type === "MANAGEMENT";

				const newNode: EmployeeNode = {
					data: newNodeEmployeeIndex,
					children: hasCapacity
						? new Array(
								newEmployee.capacity
							).fill(null)
						: []
				};

				if (
					newParentNode.children[indexInNewParent]
				) {
					console.debug(
						"Replacing child at index ",
						indexInNewParent,
						" with new child: ",
						newNode.data
					);
				}

				// See if the child already exists in the tree
				const oldParentData = findParentNode(
					treeClone,
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
				newParentNode.children[indexInNewParent] =
					newNode;

				console.debug(
					"NEW EMPLOYEE: ",
					newEmployee,
					"NEW NODE: ",
					newNode
				);

				setPlannedTree({ ...treeClone });
			} catch (error) {
				console.debug(error);
			}
		},
		[plannedTree, myEmployees]
	);

	return {
		plannedTree,
		addNode,
		setTree
	};
}

export default useTreePlanning;

