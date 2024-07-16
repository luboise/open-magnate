import { useState } from "react";
import { Clamp } from "../../../shared";

function useScalingValue(
	minScale: number = 0.01,
	maxScale: number = 8,
	scalingAmount: number = 1.5
) {
	const [scaler, setScaler] = useState<number>(1);

	function scaleUp() {
		updateScale();
	}

	function scaleDown() {
		updateScale(true);
	}

	function updateScale(down: boolean = false) {
		const newScale = Clamp(
			down
				? scaler / scalingAmount
				: scaler * scalingAmount,
			minScale,
			maxScale
		);
		setScaler(newScale);
	}

	return {
		scaler,
		scaleUp,
		scaleDown
	};
}

export default useScalingValue;

