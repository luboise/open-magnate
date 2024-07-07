import { HTMLAttributes } from "react";
import { Employee } from "../../../../../../../shared/EmployeeTypes";
import EmployeeCard from "./EmployeeCard";
import { EmployeeNode } from "./EmployeeTree";

interface EmployeeTreeNodeProps
	extends HTMLAttributes<HTMLDivElement> {
	node: EmployeeNode;
	employeeList: Employee[];
}

// 400 pixels apart
const NODE_HORIZONTAL_DISTANCE = 150;
const NODE_VERTICAL_DISTANCE = 400;

function EmployeeTreeNode(props: EmployeeTreeNodeProps) {
	const { node, employeeList, ...args } = props;

	const employee = employeeList[node.data];

	const elements: JSX.Element[] = [];

	const childNodes: JSX.Element[] = node.children.map(
		(child) =>
			child !== null ? (
				<EmployeeTreeNode
					node={child}
					employeeList={employeeList}
				/>
			) : (
				<EmployeeCard employee={employee} />
			)
	);

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
						NODE_HORIZONTAL_DISTANCE
				}}
			>
				{...childNodes}
			</div>
		</div>
	);
}

export default EmployeeTreeNode;

