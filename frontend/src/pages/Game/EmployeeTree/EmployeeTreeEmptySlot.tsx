type Props = {};

function EmployeeTreeEmptySlot({ ...args }: Props) {
	return (
		<div
			{...args}
			style={{
				width: 100,
				height: 100,
				backgroundColor: "red"
			}}
		/>
	);
}

export default EmployeeTreeEmptySlot;
