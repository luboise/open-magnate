import "./TurnHandler.css";

import Button from "../../../global_components/Button";
import SpinningStatus from "../../../global_components/SpinningStatus";
import { useDerivedGameState } from "../../../hooks/game/useDerivedGameState";
import usePageGame from "../../../hooks/game/usePageGame";
import useTreePlanning from "../../../hooks/game/useTreePlanning";
import useTurnPlanning from "../../../hooks/game/useTurnPlanning";
import TurnOrderList from "./TurnOrderList";
import { MoveType, RESTAURANT_NAMES, GameStatuses } from "magnate-core";

const BLOBBY_CLASS_NAME = "game-turn-handler-blobby";

function TurnHandler() {
	const { isMyTurn, gameStatus, currentPlayer } =
		useDerivedGameState();

	const { makeMove } = usePageGame();

	const { actions: turnActions } = useTurnPlanning();

	const { plannedTree } = useTreePlanning();

	// const playerList = useMemo(
	// () =>
	// players?.map((player) => player.playerNumber) ||
	// [],
	// [players]
	// );

	function onSubmitMove() {
		if (!isMyTurn) {
			alert(
				"It is not your turn. Unable to submit turn."
			);

			return;
		}

		if (gameStatus === "WORKING_NINE_TO_FIVE") {
			makeMove({
				moveType: MoveType.WORK_EMPLOYEES,
				actions: turnActions
			});
		} else if (gameStatus === "RESTRUCTURING") {
			makeMove({
				moveType: MoveType.RESTRUCTURE,
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
					: "Waiting on " +
					(currentPlayer === null
						? "others to ready up."
						: `${RESTAURANT_NAMES[currentPlayer.restaurantIndex] ?? "another player"}...`)}
			</h2>

			<SpinningStatus
				orderedOptions={GameStatuses}
				currentOption={gameStatus}
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
