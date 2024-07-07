import "./EmployeeCard.css";

import { HTMLAttributes } from "react";
import { Employee } from "../../../../../../../shared/EmployeeTypes";

interface EmployeeCardProps
	extends HTMLAttributes<HTMLDivElement> {
	employee: Employee;
}

function EmployeeCard(props: EmployeeCardProps) {
	const { employee } = props;

	// Real cards are 56mm x 87mm, meaning they have an aspect ratio of 56/87

	return (
		<div
			className="game-employee-card"
			style={{ backgroundColor: employee.colour }}
		>
			<span className="game-employee-card-title">
				<h3>{employee.name}</h3>
			</span>

			<div className="game-employee-card-description">
				<p></p>
				{/* TODO: Implement employee descriptions */}
				{"EMPLOYEE DESCRIPTION PLACEHOLDER"}
			</div>
		</div>
	);
}

export default EmployeeCard;

