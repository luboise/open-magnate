import { useState } from "react";
import Button from "../Button";
import "./SelectionButtonList.css";

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
				{...props.valueList.map((currentValue) => (
					<Button
						text={String(currentValue)}
						onClick={() => {
							setValue(currentValue);
						}}
						// className={
						// 	currentValue === value
						// 		? "button-selected"
						// 		: ""
						// }
						style={
							currentValue === value
								? { borderColor: "red" }
								: {}
						}
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
