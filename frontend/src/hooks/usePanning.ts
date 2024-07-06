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
								leftMouseOffset: {
									x:
										action.pos.x -
										state.leftMouseStart
											.x +
										state
											.leftMouseOffset
											.x,
									y:
										action.pos.y -
										state.leftMouseStart
											.y +
										state
											.leftMouseOffset
											.y
								}
							};
						case "RIGHT":
							return {
								...state,
								rightMouseDown: false,
								rightMouseOffset: {
									x:
										action.pos.x -
										state
											.rightMouseStart
											.x +
										state
											.rightMouseOffset
											.x,
									y:
										action.pos.y -
										state
											.rightMouseStart
											.y +
										state
											.rightMouseOffset
											.y
								}
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
		event.preventDefault();
		// console.debug("Event received: ", event);
		if (event.type === "contextmenu") return;
		else if (
			event.type === "mousemove" &&
			!state.leftMouseDown &&
			!state.rightMouseDown
		) {
			dispatch({
				actionType: "MOVED",
				pos: {
					x: event.clientX,
					y: event.clientY
				}
			});
		}

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
		document.body.addEventListener(
			"contextmenu",
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
			document.body.removeEventListener(
				"contextmenu",
				mouseEvent
			);
		};
	});

	useEffect(() => {
		console.debug(
			"Panning state offset changed: ",
			// state
			state.leftMouseOffset.x,
			state.leftMouseOffset.y,
			state.rightMouseOffset.x,
			state.rightMouseOffset.y
		);
	}, [
		state.leftMouseOffset.x,
		state.leftMouseOffset.y,
		state.rightMouseOffset.x,
		state.rightMouseOffset.y
		// state
	]);

	return {
		leftMouseOffset: {
			x:
				state.leftMouseOffset.x +
				(state.leftMouseDown
					? state.currentPos.x -
						state.leftMouseStart.x
					: 0),
			y:
				state.leftMouseOffset.y +
				(state.leftMouseDown
					? state.currentPos.y -
						state.currentPos.y
					: 0)
		},
		rightMouseOffset: {
			x:
				state.rightMouseOffset.x +
				(state.rightMouseDown
					? state.currentPos.x -
						state.rightMouseStart.x
					: 0),
			y:
				state.rightMouseOffset.y +
				(state.rightMouseDown
					? state.currentPos.y -
						state.rightMouseStart.y
					: 0)
		}
	};
}

export default usePanning;

