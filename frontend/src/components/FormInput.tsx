import "./FormInput.css";

function FormInput(props: {
	name: string;
	labelText?: string;
}) {
	return (
		<div className="form-input">
			<label htmlFor={props.name}>
				{/* Use regex for default name */}
				{props.labelText ||
					props.name
						.replaceAll(/((?!^)[A-Z])/g, " $1")
						.trim()}
				:
			</label>
			<input name={props.name} type="text" />
		</div>
	);
}

export default FormInput;
