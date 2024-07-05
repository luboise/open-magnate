import { useReducer, useState } from "react";

interface MouseDownState {
	leftMouseDown: boolean;
	rightMouseDown: boolean;
}

interface MouseDownAction {
	button: "LEFT" | "RIGHT";,
	result: "UP" | "DOWN";
}

function useMouseDown() {
	const [mouseDown, setMouseDown] = useState(false);

	const [state, dispatch] = useReducer(
		(state: MouseDownState, action: MouseDownAction) => {},{}
	);

	return [];
}

export default useMouseDown;

