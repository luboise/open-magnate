import { useState } from "react";
import "./FormInput.css";

function FormInput(props: {
	name: string;
	labelText?: string;
	regex?: RegExp;
	defaultValue?: string;
	valueList?: string[];
}) {
	const [value, setValue] = useState<string>(
		props.defaultValue || ""
	);

	function sanitise() {
		let finalValue = value.trim();
		if (props.regex) {
			finalValue =
				value.match(props.regex)?.[0] || "";
		}
		if (props.valueList && props.valueList.length > 0) {
			if (!props.valueList.includes(finalValue)) {
				finalValue = props.valueList[0];
			}
		}

		setValue(finalValue || props.defaultValue || "");
	}

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
			<input
				name={props.name}
				type="text"
				value={value}
				onChange={(event) =>
					setValue(event.target.value)
				}
				onBlur={sanitise}
				onSubmit={sanitise}
			/>
		</div>
	);
}

export default FormInput;
