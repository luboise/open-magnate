import { useState } from "react";
import Button from "../Button";
import "./FormInput.css";

function SelectionButtonList<T>(props: {
	name: string;
	labelText?: string;
	defaultValue?: T;
	valueList: T[];
}) {
	const [value, setValue] = useState<T>(
		props.defaultValue ?? props.valueList[0]
	);

	return (
		<>
			<div className="selection-btn-list">
				{...props.valueList.map((value) => (
					<Button
						text={String(value)}
						onClick={() => {
							setValue(value);
						}}
					/>
				))}
			</div>
			<input
				style={{ display: "none" }}
				name={props.name}
				value={String(value)}
			/>
		</>
	);
}

export default SelectionButtonList;

