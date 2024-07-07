import { HTMLAttributes } from "react";
import { Employee } from "../../../../../../../shared/EmployeeTypes";
import EmployeeCard from "./EmployeeCard";

interface EmployeeTreeNodeProps
	extends HTMLAttributes<HTMLDivElement> {
	employee: Employee;
}

function EmployeeTreeNode(props: EmployeeTreeNodeProps) {
	const { employee, ...args } = props;
	return (
		<div className="game-employee-tree-node" {...args}>
			<EmployeeCard employee={employee} />
		</div>
	);
}

export default EmployeeTreeNode;
