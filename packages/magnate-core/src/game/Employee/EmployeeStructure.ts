import { Employee } from ".";
import { TreeNode } from "../../utils";

export type EmployeeNode = TreeNode<number>;

const EMPLOYEE_SEP_CHAR = ",";
const EMPLOYEE_NULL_CHAR = "X";
const EMPLOYEE_CHILDREN_START_CHAR = "[";
const EMPLOYEE_CHILDREN_END_CHAR = "]";

export const EmployeeNode = {
	isValidTree(
		treeRoot: EmployeeNode,
		employeeList: Employee[]
	) {
		if (!treeRoot) return false;

		const set = new Set<number>();
		return checkNode(treeRoot, employeeList, set, 0);
	},

	treeContainsValue(
		root: EmployeeNode,
		value: number
	): boolean {
		if (root.data === value) {
			return true;
		}

		return root.children
			.filter((val) => val != null)
			.some((child) =>
				EmployeeNode.treeContainsValue(child, value)
			);
	},

	countEmptySlots(treeRoot: EmployeeNode): number {
		let count = 0;
		function traverse(node: EmployeeNode) {
			for (const child of node.children) {
				if (child === null) count += 1;
				else traverse(child);
			}
		}

		traverse(treeRoot);
		return count;
	},

	getAllTreeData<T>(
		node: TreeNode<T>,
		nullChar?: T
	): Array<T> {
		let data: Array<T> = [node.data];

		for (const child of node.children) {
			if (child === null) {
				if (nullChar) {
					data.push(nullChar);
				}
				continue;
			}
			data = data.concat(
				EmployeeNode.getAllTreeData(child, nullChar)
			);
		}

		return data;
	},

	serialiseTree(rootNode: EmployeeNode): string {
		let tempString = String(rootNode.data);

		const hasChildren = rootNode.children.length > 0;

		if (!hasChildren) return tempString;

		const children = rootNode.children.map((child) => {
			if (child === null) return EMPLOYEE_NULL_CHAR;
			return EmployeeNode.serialiseTree(child);
		});

		return (
			tempString +
			EMPLOYEE_CHILDREN_START_CHAR +
			children.join(EMPLOYEE_SEP_CHAR) +
			EMPLOYEE_CHILDREN_END_CHAR
		);
	},

	// Epic ChatGPT function.
	// TODO: Check the performance of this later and make sure it runs ok
	deserialiseTree(inString: string): EmployeeNode | null {
		function parseNode(
			input: string
		): [EmployeeNode | null, string] {
			// Base case: Check for 'X' representing null
			if (input.startsWith("X")) {
				return [null, input.slice(1)];
			}

			// Parse the root data number
			const numberMatch = input.match(/^(\d+)/);
			if (!numberMatch)
				throw new Error("Invalid input format");

			const data = parseInt(numberMatch[1]);
			let remainingInput = input.slice(
				numberMatch[1].length
			);

			// If the next character is '[', parse the children
			let children: (EmployeeNode | null)[] = [];
			if (remainingInput.startsWith("[")) {
				remainingInput = remainingInput.slice(1); // Remove '['
				while (!remainingInput.startsWith("]")) {
					const [childNode, newRemainingInput] =
						parseNode(remainingInput);
					children.push(childNode);

					remainingInput = newRemainingInput;
					if (remainingInput.startsWith(",")) {
						remainingInput =
							remainingInput.slice(1); // Remove ','
					} else if (
						!remainingInput.startsWith("]")
					) {
						throw new Error(
							"Invalid input format"
						);
					}
				}
				remainingInput = remainingInput.slice(1); // Remove ']'
			}

			const node: EmployeeNode = { data, children };
			return [node, remainingInput];
		}

		try {
			const [rootNode, _] = parseNode(inString);
			return rootNode;
		} catch (error) {
			console.error(
				"Error parsing employee tree:",
				error
			);
		}
		return null;
	}
};

// Private

function checkNode(
	node: EmployeeNode,
	list: Employee[],
	set: Set<number>,
	depth: number
): boolean {
	// Check that the index is valid
	const index = node.data;
	if (
		Number.isNaN(index) ||
		index < 0 ||
		index >= list.length ||
		!Number.isInteger(index)
	)
		return false;
	if (set.has(index)) return false;

	set.add(index);
	const employee = list[index];

	switch (depth) {
		case 0:
			if (employee.department !== "CEO") return false;
			break;
		case 1:
			if (employee.department === "CEO") return false;
			break;
		case 2:
			if (
				employee.department === "CEO" ||
				employee.department === "MANAGEMENT"
			)
				return false;
			break;

		// The max depth is 2
		default:
			return false;
	}

	// Check valid child counts
	if (
		employee.department === "CEO" ||
		employee.department === "MANAGEMENT"
	) {
		if (node.children.length !== employee.capacity)
			return false;
	} else {
		if (node.children.length > 0) return false;
	}

	// Recursively check children

	for (const child of node.children) {
		if (child === null) continue;

		if (!checkNode(child, list, set, depth + 1))
			return false;
	}

	return true;
}
