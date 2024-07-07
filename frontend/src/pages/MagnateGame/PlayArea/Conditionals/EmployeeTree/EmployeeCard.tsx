import "./EmployeeCard.css";

import { Employee } from "../../../../../../../shared/EmployeeTypes";
import { Colour } from "../../../../../utils";

interface EmployeeCardProps {
	employee: Employee;
}

const EMPLOYEE_CARD_DESCRIPTION_COLOUR: Colour = "#FDF2DA";

function EmployeeCard(props: EmployeeCardProps) {
	const { employee } = props;

	// Real cards are 56mm x 87mm, meaning they have an aspect ratio of 56/87

	return (
		<div
			className="game-employee-card"
			style={{
				display: "flex",
				flexDirection: "column",
				aspectRatio: "56/87",
				border: "0.15vw solid black"
			}}
		>
			<div className="game-employee-card-title">
				<h3>{employee.name}</h3>
			</div>

			<div
				className="game-employee-card-description"
				style={{
					display: "position",
					width: "100%",

					justifyContent: "center",
					alignItems: "center",
					// flexDirection: "column",
					fontSize: "1.2vw",
					color: "black",
					backgroundColor:
						EMPLOYEE_CARD_DESCRIPTION_COLOUR,
					padding: "10px",
					height: "40%"
				}}
			>
				<p></p>
				{/* TODO: Implement employee descriptions */}
				{"EMPLOYEE DESCRIPTION PLACEHOLDER"}
			</div>
		</div>
	);
}

export default EmployeeCard;

