import { HTMLAttributes } from "react";
import { EmployeeNode } from "../../../../../shared/EmployeeStructure";
import { Employee } from "../../../../../shared/EmployeeTypes";
import EmployeeCard from "../Employees/EmployeeCard";
import {
	EmployeeTreeSpreadIfDragCallback,
	EmployeeTreeSpreadIfDropCallback
} from "./EmployeeTree";
import EmployeeTreeEmptySlot from "./EmployeeTreeEmptySlot";

export type TreeNodeDropCallback = (
	parent: number,
	newChild: number,
	parentIndex: number
) => void;

export interface ParentDetailsInterface {
	parentNode: EmployeeNode;
	indexInParent: number;
}

export interface EmployeeTreeNodeDropDetails {
	droppedOnto: number | null;
	parentReceiving: number;
	indexInParent: number;
}

interface BaseProps {
	dragTarget: boolean;
	dropTarget: boolean;
	employeeDetails: Employee | null;
	employeeIndex: number;
	parentEmployeeIndex: number;
	parentDetails: ParentDetailsInterface;
}

interface EmptySlotProps extends BaseProps {
	employeeDetails: null;
}

interface CardSlotProps extends BaseProps {
	employeeDetails: Employee;
}

type CardMakerCallbackProps =
	| EmptySlotProps
	| CardSlotProps;

export type CardMakerCallbackType =
	({}: CardMakerCallbackProps) => JSX.Element;

interface EmployeeTreeNodeProps
	extends HTMLAttributes<HTMLDivElement> {
	node: EmployeeNode;
	employeeList: Employee[];
	// cardMakerCallback: CardMakerCallbackType;
	spreadIfDrag: EmployeeTreeSpreadIfDragCallback;
	spreadIfDrop: EmployeeTreeSpreadIfDropCallback;
	depth?: number;
	parentDetails?: ParentDetailsInterface | undefined;
}

// 400 pixels apart
const NODE_HORIZONTAL_DISTANCE = 100;
const NODE_VERTICAL_DISTANCE = 400;

function EmployeeTreeNode({
	node,
	employeeList,
	depth = 1,
	// dropCallback,
	// cardMakerCallback,
	spreadIfDrag,
	spreadIfDrop,
	...args
}: EmployeeTreeNodeProps) {
	const employee = employeeList[node.data];

	const childNodes: JSX.Element[] = node.children.map(
		(child, indexInParent) => {
			return child !== null ? (
				<EmployeeTreeNode
					node={child}
					employeeList={employeeList}
					depth={depth + 1}
					parentDetails={{
						parentNode: node,
						indexInParent: indexInParent
					}}
					spreadIfDrag={spreadIfDrag}
					spreadIfDrop={spreadIfDrop}
				/>
			) : (
				<EmployeeTreeEmptySlot
					{...spreadIfDrop({
						parentReceiving: node.data,
						indexInParent,
						droppedOnto: null
					})}
				/>
			);
		}
	);

	const depthMap: Record<number, number> = {
		1: 310,
		2: 108,
		3: 200
	};

	// // TODO: Double check parent index is correct
	// const cardElement = useMemo(() => {
	// 	if (
	// 		parentNode &&
	// 		!parentNode.children.includes(node)
	// 	) {
	// 		throw new Error("");
	// 	}

	// 	return cardMakerCallback({
	// 		employeeDetails: employee,
	// 		parentDetails: parentDetails,
	// 		parentEmployeeIndex: parentNode?.data ?? 0,
	// 		dragTarget: depth > 1,
	// 		dropTarget: true,
	// 		employeeIndex: node.data
	// 	});
	// }, [cardMakerCallback]);

	return (
		<div className="game-employee-tree-node" {...args}>
			<EmployeeCard
				employee={employeeList[node.data]}
			/>
			<div
				className="game-employee-tree-node-children"
				style={{
					position: "absolute",
					translate: "-50% 50%",
					left: "50%",
					width:
						childNodes.length * depthMap[depth]
				}}
			>
				{...childNodes}
			</div>
		</div>
	);
}

export default EmployeeTreeNode;
