interface EmployeeCardProps {
	name: string;
	description: string;
}

function EmployeeCard(props: EmployeeCardProps) {
	return (
		<div
			className="game-employee-card"
			style={{
				display: "flex",
				flexDirection: "column"
			}}
		>
			<h3>{props.name}</h3>
			<div className="game-employee-card-description">
				{props.description}
			</div>
		</div>
	);
}

export default EmployeeCard;

