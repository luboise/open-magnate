import "./FormInput.css";

function FormInput(props: {
	name: string;
	labelText?: string;
}) {
	return (
		<div className="form-input">
			<label htmlFor={props.name}>
				{props.labelText || props.name}:
			</label>
			<input name={props.name} type="text" />
		</div>
	);
}

export default FormInput;
