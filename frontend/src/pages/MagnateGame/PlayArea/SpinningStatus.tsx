import { HTMLAttributes, useEffect, useState } from "react";

interface SpinningStatusProps<T>
	extends HTMLAttributes<HTMLDivElement> {
	orderedOptions: ReadonlyArray<T>;
	currentOption: T | null;
}

function SpinningStatus<T>(props: SpinningStatusProps<T>) {
	const { orderedOptions, currentOption } = props;

	type ValidOption = (typeof orderedOptions)[number];

	const [currentValue, setCurrentValue] =
		useState<ValidOption | null>(props.currentOption);

	useEffect(() => {
		if (currentOption === null) {
			setCurrentValue(null);
			return;
		}

		setCurrentValue(
			orderedOptions.includes(currentOption)
				? currentOption
				: null
		);
	}, [currentOption]);

	return (
		<div className="spinning-status">
			{String(currentValue)}
		</div>
	);
}

export default SpinningStatus;
