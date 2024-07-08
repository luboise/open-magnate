import { HTMLAttributes } from "react";
import { EmployeeNode } from "../../../../../../../shared/EmployeeStructure";
import { Employee } from "../../../../../../../shared/EmployeeTypes";
import EmployeeCard from "./EmployeeCard";

interface EmployeeTreeNodeProps
	extends HTMLAttributes<HTMLDivElement> {
	node: EmployeeNode;
	employeeList: Employee[];
	depth?: number;
}

// 400 pixels apart
const NODE_HORIZONTAL_DISTANCE = 100;
const NODE_VERTICAL_DISTANCE = 400;

function EmployeeTreeNode(props: EmployeeTreeNodeProps) {
	const { node, employeeList, depth, ...args } = props;
	const checkedDepth = depth ?? 1;

	const employee = employeeList[node.data];

	// console.debug(
	// 	"Children of node ",
	// 	node,
	// 	": ",
	// 	node.children
	// );

	const childNodes: JSX.Element[] = node.children.map(
		(child) =>
			child !== null ? (
				<EmployeeTreeNode
					node={child}
					employeeList={employeeList}
					depth={checkedDepth + 1}
				/>
			) : (
				<div
					style={{
						width: 100,
						height: 100,
						backgroundColor: "red"
					}}
				/>
			)
	);

	const depthMap: Record<number, number> = {
		1: 310,
		2: 108,
		3: 200
	};

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
						childNodes.length *
						depthMap[checkedDepth]
				}}
			>
				{...childNodes}
			</div>
		</div>
	);
}

export default EmployeeTreeNode;

