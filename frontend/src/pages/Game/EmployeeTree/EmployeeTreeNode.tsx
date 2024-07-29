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

interface EmployeeTreeNodeProps
	extends HTMLAttributes<HTMLDivElement> {
	node: EmployeeNode;
	employeeList: Employee[];
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
	spreadIfDrag,
	spreadIfDrop,
	parentDetails,
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

	return (
		<div className="game-employee-tree-node" {...args}>
			<EmployeeCard
				employee={employee}
				{...(parentDetails
					? spreadIfDrop({
							droppedOnto: node.data,
							parentReceiving:
								parentDetails.parentNode
									.data,
							indexInParent:
								parentDetails.indexInParent
						})
					: {})}
				{...(depth > 1
					? spreadIfDrag(node.data)
					: {})}
			/>
			<div
				className="game-employee-tree-node-children"
				style={{
					position: "absolute",
					translate: "-50% 50%",
					left: "50%",
					width:
						childNodes.length *
							depthMap[depth] ?? undefined
				}}
			>
				{...childNodes}
			</div>
		</div>
	);
}

export default EmployeeTreeNode;
