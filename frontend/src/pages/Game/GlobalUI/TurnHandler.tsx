import "./TurnHandler.css";

import { useMemo } from "react";
import { MOVE_TYPE } from "../../../../../shared/Moves";
import Button from "../../../global_components/Button";
import SpinningStatus from "../../../global_components/SpinningStatus";
import { useGameStateView } from "../../../hooks/game/useGameState";
import usePageGame from "../../../hooks/game/usePageGame";
import useTreePlanning from "../../../hooks/game/useTreePlanning";
import useTurnPlanning from "../../../hooks/game/useTurnPlanning";
import {
	RESTAURANT_NAMES,
	TURN_PROGRESS_VALUES
} from "../../../utils";
import TurnOrderList from "./TurnOrderList";

const BLOBBY_CLASS_NAME = "game-turn-handler-blobby";

function TurnHandler() {
	const {
		isMyTurn,
		turnProgress,
		players,
		currentPlayer
	} = useGameStateView();

	const { makeMove } = usePageGame();

	const { turnActions } = useTurnPlanning();

	const { plannedTree } = useTreePlanning();

	const playerList = useMemo(
		() =>
			players?.map((player) => player.playerNumber) ||
			[],
		[players]
	);

	function onSubmitMove() {
		if (!isMyTurn) {
			alert(
				"It is not your turn. Unable to submit turn."
			);

			return;
		}

		if (turnProgress === "USE_EMPLOYEES") {
			makeMove({
				MoveType: MOVE_TYPE.TAKE_TURN,
				actions: turnActions
			});
		} else if (turnProgress === "RESTRUCTURING") {
			makeMove({
				MoveType: MOVE_TYPE.RESTRUCTURE,
				tree: plannedTree
			});
		}
	}

	return (
		<div id="game-turn-handler">
			<h2
				className={`${isMyTurn ? "glowing" : undefined} ${BLOBBY_CLASS_NAME}`}
				style={{
					gridRow: "1",
					gridColumn: "1 / span 2",
					// width: "50%",
					margin: "auto",
					textAlign: "center",
					padding: "0.5em 1em"
				}}
			>
				{isMyTurn
					? "Your turn"
					: "Waiting for " +
						(currentPlayer === null
							? "others to ready up."
							: `${RESTAURANT_NAMES[currentPlayer.restaurant]}...`)}
			</h2>

			<SpinningStatus
				orderedOptions={TURN_PROGRESS_VALUES}
				currentOption={turnProgress}
				style={{
					gridRow: "2 / span 1",
					gridColumn: "1 / span 1"
				}}
				className={BLOBBY_CLASS_NAME}
			/>

			{/* 
			<SpinningStatus
				orderedOptions={playerList.map((player) =>
					String(player)
				)}
				currentOption={turnProgress}
				style={{
					gridRow: "3",
					gridColumn: "1"
				}}
			/> */}

			<div
				id="game-turn-handler-turn-order-section"
				style={{
					gridRow: "3",
					gridColumn: "1"
				}}
			>
				<h3>Turn Order</h3>
				<TurnOrderList />
			</div>

			<Button
				onClick={onSubmitMove}
				style={{
					gridColumn: "2",
					gridRow: "2 / span 2"
				}}
				inactive={!isMyTurn}
				inactiveHoverText="It is not currently your turn."
			>
				Submit
			</Button>
		</div>
	);
}

export default TurnHandler;

