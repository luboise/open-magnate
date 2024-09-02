import React, {
	InputHTMLAttributes,
	useMemo,
	useState
} from "react";

type UIOptionType = "Slider" | "Number" | "Text";

const ConstantInputMap: Record<
	UIOptionType,
	InputHTMLAttributes<HTMLInputElement>
> = {
	Slider: {
		type: "range"
	},
	Number: {},
	Text: {}
} as const;

type InputParams<T extends UIOptionType> =
	T extends "Slider"
		? {
				min: number;
				max: number;
				step?: number;
			}
		: T extends "Number"
			? {
					min: number;
					max: number;
					step?: number;
				}
			: T extends "Text"
				? {
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

function UIOption<T extends UIOptionType>(
	props: { type: T } & InputParams<T> & {
			onSet: (val: UIMap<T>) => void | Promise<void>;
		}
) {
	type ValueType = UIMap<T>;

	const [val, setVal] = useState<ValueType>(0);

	function updateValue(
		changeEvent: React.ChangeEvent<HTMLInputElement>
	) {
		changeEvent.preventDefault();
		const value = changeEvent.target.value;

		setVal(value as ValueType);
		props.onSet(value as ValueType);
	}

	const option = useMemo((): JSX.Element => {
		if (props.type === "Slider") {
			const { type, onSet, ...others } = props;
			return (
				<input
					value={val}
					onChange={updateValue}
					{...others}
					{...ConstantInputMap[props.type]}
				/>
			);
		}

		return <>Invalid UIOption</>;
	}, [props]);

	return (
		<div className="ui-option-wrapper">{option}</div>
	);
}

export default UIOption;
