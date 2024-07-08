import { useState } from "react";
import { Clamp } from "../utils";

function useScalingValue(
	minScale: number = 0.01,
	maxScale: number = 8,
	scalingAmount: number = 2
) {
	const [scaler, setScaler] = useState<number>(1);

	function onScaleUp() {
		setScaler(
			Clamp(
				scaler * scalingAmount,
				minScale,
				maxScale
			)
		);
	}

	function onScaleDown() {
		setScaler(
			Clamp(
				scaler / scalingAmount,
				minScale,
				maxScale
			)
		);
	}

	return {
		scaler,
		onScaleUp,
		onScaleDown
	};
}

export default useScalingValue;

