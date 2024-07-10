import React, {
	useCallback,
	useEffect,
	useReducer
} from "react";
import { Position } from "../utils";
import useLocalVal from "./useLocalVal";

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

type MouseEventType = globalThis.MouseEvent;

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

function usePanning(panId: string) {
	if (!panId)
		throw new Error(
			"A Pan ID is required when using usePanning()."
		);

	const [panningOptions, setPanningOptions] =
		useLocalVal<{
			leftOffset: Position;
			rightOffset: Position;
		}>(`panning-options-${panId}`);

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
				offset: panningOptions?.leftOffset ?? {
					x: 0,
					y: 0
				}
			},
			rightButton: {
				isDown: false,
				startPosition: null,
				offset: panningOptions?.rightOffset ?? {
					x: 0,
					y: 0
				}
			},

			currentPos: { x: 0, y: 0 }
		}
	);

	const onMouseEvent = useCallback(
		(
			event: React.MouseEvent | globalThis.MouseEvent
		) => {
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

				if (result === "DOWN") {
					event.preventDefault();
					event.stopPropagation();
				}

				console.debug("Dropped");

				// event.preventDefault();
				// event.stopPropagation();
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
			// true
		);
		document.body.addEventListener(
			"mousemove",
			onMouseEvent
			// true
		);

		// Clean up event listeners
		return () => {
			// element.removeEventListener(
			// 	"mousedown",
			// 	mouseEvent,
			// 	true
			// );
			document.body.removeEventListener(
				"mouseup",
				onMouseEvent
				// true
			);
			document.body.removeEventListener(
				"mousemove",
				onMouseEvent
				// true
			);
		};
	});

	useEffect(() => {
		setPanningOptions({
			leftOffset: state.leftButton.offset,
			rightOffset: state.rightButton.offset
		});
	}, [state.leftButton.offset]);

	function startLeftPan(event: MouseEventType) {
		onMouseEvent(event);
	}

	function startRightPan(event: MouseEventType) {
		onMouseEvent(event);
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
