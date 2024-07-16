import { HTMLAttributes, useEffect, useState } from "react";
import { toTitleCase } from "../../../shared/utils";

interface SpinningStatusProps<T>
	extends HTMLAttributes<HTMLDivElement> {
	orderedOptions: ReadonlyArray<T>;
	currentOption: T | null;
	useTitleCase?: boolean;
}

function SpinningStatus<T>({
	useTitleCase = true,
	orderedOptions,
	currentOption,
	...args
}: SpinningStatusProps<T>) {
	type ValidOption = (typeof orderedOptions)[number];

	const [currentValue, setCurrentValue] =
		useState<ValidOption | null>(currentOption);

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
		<div className="spinning-status" {...args}>
			{useTitleCase
				? toTitleCase(String(currentValue))
				: String(currentValue)}
		</div>
	);
}

export default SpinningStatus;

