import "./UIOption.css";

import { Slider } from "@mui/material";
import { ReactNode } from "react";

type UIOptionType = "Slider" | "Number" | "Text";

type InputParams<T extends UIOptionType> =
	T extends "Slider"
		? {
				defaultValue: UIMap<T>;
				min: number;
				max: number;
				step?: number;
			}
		: T extends "Number"
			? {
					defaultValue: UIMap<T>;
					min: number;
					max: number;
					step?: number;
				}
			: T extends "Text"
				? {
						defaultValue: UIMap<T>;
						pattern: RegExp;
					}
				: never;

type UIMap<T extends UIOptionType> = T extends "Slider"
	? number
	: T extends "Number"
		? number
		: T extends "Text"
			? string
			: never;

interface Props<T extends UIOptionType> {
	optionType: T;
	params: InputParams<T>;
	label: string;
	onUpdate: (val: UIMap<T>) => void | Promise<void>;
	extra?: JSX.Element | ReactNode;
}

function UIOption<T extends UIOptionType>({
	optionType,
	params,
	label,
	onUpdate,
	extra = <></>
}: Props<T>) {
	const option =
		optionType === "Slider" ? (
			<Slider
				defaultValue={params.defaultValue}
				min={params.min}
				max={params.max}
				onChange={(_, value) =>
					onUpdate(
						(Array.isArray(value)
							? value[0]
							: value) as UIMap<T>
					)
				}
			/>
		) : (
			<>Invalid UIOption</>
		);

	return (
		<div className="ui-option-wrapper">
			<div className="ui-option-name">{label}</div>
			{option}
			{extra}
		</div>
	);
}

export default UIOption;
