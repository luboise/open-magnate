import { useCallback, useEffect, useReducer } from "react";
import { Position } from "../utils";

interface MouseOffsetData {
	isDown: boolean;
	startPosition: Position | null;
	offset: Position;
}

interface PanningState {
	leftButton: MouseOffsetData;
	rightButton: MouseOffsetData;

	currentPos: Position;
}

type MouseDownAction =
	| {
			actionType: "LEFT" | "RIGHT";
			result: "UP" | "DOWN";
			pos: Position;
	  }
	| { actionType: "MOVED"; pos: Position };

function calculateOffset(
	data: MouseOffsetData,
	pos: Position
): Position {
	return data.startPosition
		? {
				x:
					pos.x -
					data.startPosition.x +
					data.offset.x,
				y:
					pos.y -
					data.startPosition.y +
					data.offset.y
			}
		: { ...data.offset };
}

function usePanning() {
	const [state, dispatch] = useReducer(
		(state: PanningState, action: MouseDownAction) => {
			if (action.actionType === "MOVED") {
				return {
					...state,
					currentPos: { ...action.pos }
				};
			}

			const updateButtonState = (
				pressed: "leftButton" | "rightButton",
				isDown: boolean
			) => ({
				...state,
				[pressed]: {
					...state[pressed],
					isDown,
					startPosition: isDown
						? { ...action.pos }
						: null,
					offset: isDown
						? state[pressed].offset
						: calculateOffset(
								state[pressed],
								action.pos
							)
				}
			});

			const button =
				action.actionType === "LEFT"
					? "leftButton"
					: "rightButton";

			switch (action.result) {
				case "DOWN":
					return updateButtonState(button, true);
				case "UP":
					return state[button].isDown
						? updateButtonState(button, false)
						: state;
				default:
					return state;
			}
		},

		{
			leftButton: {
				isDown: false,
				startPosition: null,
				offset: { x: 0, y: 0 }
			},
			rightButton: {
				isDown: false,
				startPosition: null,
				offset: { x: 0, y: 0 }
			},

			currentPos: { x: 0, y: 0 }
		}
	);

	const onMouseEvent = useCallback(
		(event: MouseEvent) => {
			const {
				type,
				button,
				clientX: x,
				clientY: y
			} = event;
			const pos = { x, y };

			if (type === "mousemove") {
				dispatch({ actionType: "MOVED", pos });
				return;
			}

			const actionType =
				button === 0
					? "LEFT"
					: button === 2
						? "RIGHT"
						: null;

			if (
				actionType &&
				(type === "mousedown" || type === "mouseup")
			) {
				const result =
					type === "mousedown" ? "DOWN" : "UP";

				// event.preventDefault();
				event.stopPropagation();
				dispatch({ actionType, result, pos });
			}
		},
		[]
	);

	useEffect(() => {
		// element.addEventListener(
		// 	"mousedown",
		// 	mouseEvent,
		// 	true
		// );
		document.body.addEventListener(
			"mouseup",
			onMouseEvent
		);
		document.body.addEventListener(
			"mousemove",
			onMouseEvent
		);
		// element.addEventListener(
		// 	"contextmenu",
		// 	mouseEvent
		// );

		// Clean up event listeners
		return () => {
			// element.removeEventListener(
			// 	"mousedown",
			// 	mouseEvent,
			// 	true
			// );
			document.body.removeEventListener(
				"mouseup",
				onMouseEvent,
				true
			);
			document.body.removeEventListener(
				"mousemove",
				onMouseEvent,
				true
			);
			// element.removeEventListener(
			// 	"contextmenu",
			// 	mouseEvent
			// );
		};
	});

	function startLeftPan(event: MouseEvent) {
		onMouseEvent(event);
		// event.preventDefault();

		// if (event.button === 0)
		// 	dispatch({
		// 		actionType: "LEFT",
		// 		result: "DOWN",
		// 		pos: {
		// 			x: event.clientX,
		// 			y: event.clientY
		// 		}
		// 	});
	}

	function startRightPan(event: MouseEvent) {
		onMouseEvent(event);
		// event.preventDefault();

		// if (event.button === 2)
		// 	dispatch({
		// 		actionType: "RIGHT",
		// 		result: "DOWN",
		// 		pos: {
		// 			x: event.clientX,
		// 			y: event.clientY
		// 		}
		// 	});
	}

	// useEffect(
	// 	() =>
	// 		console.debug(
	// 			"Panning state changed: ",
	// 			state.leftButton,
	// 			state.rightButton,
	// 			state.currentPos
	// 		),
	// 	[state.leftButton, state.rightButton]
	// );

	return {
		startLeftPan,
		startRightPan,
		leftMouseOffset: state.leftButton.isDown
			? calculateOffset(
					state.leftButton,
					state.currentPos
				)
			: state.leftButton.offset,
		rightMouseOffset: state.rightButton.isDown
			? calculateOffset(
					state.rightButton,
					state.currentPos
				)
			: state.rightButton.offset
	};
}

export default usePanning;
