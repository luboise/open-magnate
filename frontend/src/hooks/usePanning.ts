import { useCallback, useEffect, useReducer } from "react";
import { Position } from "../utils";

interface MouseDownState {
	leftMouseDown: boolean;
	leftMouseStart: Position;
	leftMouseOffset: Position;

	rightMouseDown: boolean;
	rightMouseStart: Position;
	rightMouseOffset: Position;

	currentPos: Position;
}

type MouseDownAction =
	| {
			actionType: "LEFT" | "RIGHT";
			result: "UP" | "DOWN";
			pos: Position;
	  }
	| { actionType: "MOVED"; pos: Position };

function usePanning() {
	const [state, dispatch] = useReducer(
		(
			state: MouseDownState,
			action: MouseDownAction
		) => {
			if (action.actionType === "MOVED") {
				return {
					...state,
					currentPos: action.pos
				};
			}

			switch (action.result) {
				case "DOWN":
					switch (action.actionType) {
						case "LEFT":
							return {
								...state,
								leftMouseDown: true,
								leftMouseStart: action.pos
							};
						case "RIGHT":
							return {
								...state,
								rightMouseDown: true,
								rightMouseStart: action.pos
							};
					}
				case "UP":
					switch (action.actionType) {
						case "LEFT":
							return {
								...state,
								leftMouseDown: false,
								recordLeftMouse: true
							};
						case "RIGHT":
							return {
								...state,
								rightMouseDown: false,
								recordRightMouse: true
							};
					}
				default:
					return state;
			}
		},
		{
			leftMouseDown: false,
			leftMouseStart: { x: 0, y: 0 },
			leftMouseOffset: { x: 0, y: 0 },

			rightMouseDown: false,
			rightMouseStart: { x: 0, y: 0 },
			rightMouseOffset: { x: 0, y: 0 },

			currentPos: { x: 0, y: 0 }
		}
	);

	const mouseEvent = useCallback((event: MouseEvent) => {
		if (event.button === 0) {
			if (event.type === "mousedown") {
				dispatch({
					actionType: "LEFT",
					result: "DOWN",
					pos: {
						x: event.clientX,
						y: event.clientY
					}
				});
			} else if (event.type === "mouseup") {
				dispatch({
					actionType: "LEFT",
					result: "UP",
					pos: {
						x: event.clientX,
						y: event.clientY
					}
				});
			}
		}
		// Right click
		else if (event.button === 2) {
			if (event.type === "mousedown") {
				dispatch({
					actionType: "RIGHT",
					result: "DOWN",
					pos: {
						x: event.clientX,
						y: event.clientY
					}
				});
			} else if (event.type === "mouseup") {
				dispatch({
					actionType: "RIGHT",
					result: "UP",
					pos: {
						x: event.clientX,
						y: event.clientY
					}
				});
			}
		}
	}, []);

	useEffect(() => {
		document.body.addEventListener(
			"mousedown",
			mouseEvent
		);
		document.body.addEventListener(
			"mouseup",
			mouseEvent
		);
		document.body.addEventListener(
			"mousemove",
			mouseEvent
		);

		// Clean up event listeners
		return () => {
			document.body.removeEventListener(
				"mousedown",
				mouseEvent
			);
			document.body.removeEventListener(
				"mouseup",
				mouseEvent
			);
			document.body.removeEventListener(
				"mousemove",
				mouseEvent
			);
		};
	});

	return {};
}

export default usePanning;

