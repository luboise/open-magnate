import { Employee } from "../../../../../shared/EmployeeTypes";
import "./EmployeeCard.css";

import { HTMLAttributes } from "react";

interface EmployeeCardProps
	extends HTMLAttributes<HTMLDivElement> {
	employee: Employee;
}

function EmployeeCard(props: EmployeeCardProps) {
	const { employee, className, style, ...args } = props;

	// Real cards are 56mm x 87mm, meaning they have an aspect ratio of 56/87

	return (
		<div
			className={`game-employee-card${className ? " " + className : ""}`}
			style={{
				backgroundColor: employee.colour,
				...style,
				pointerEvents: "auto"
			}}
			{...args}
		>
			<span className="game-employee-card-title">
				<h3>{employee.name}</h3>
			</span>

			<div className="game-employee-card-description">
				<p>{"EMPLOYEE DESCRIPTION PLACEHOLDER"}</p>
				{/* TODO: Implement employee descriptions */}
				{employee.notPaid ? (
					<></>
				) : (
					<div className="game-employee-card-salary-div">
						$
					</div>
				)}
			</div>
		</div>
	);
}

export default EmployeeCard;
