import "./TurnHandler.css";

import { useMemo } from "react";
import Button from "../../../components/Button";
import { useGameState } from "../../../hooks/useGameState";

import { TURN_PROGRESS_VALUES } from "../../../../../backend/src/dataViews";
import { RESTAURANT_NAMES } from "../../../utils";
import SpinningStatus from "./SpinningStatus";
import TurnOrderList from "./TurnOrderList";

const BLOBBY_CLASS_NAME = "game-turn-handler-blobby";

function TurnHandler() {
	const {
		isMyTurn,
		turnProgress,
		players,
		currentPlayer
	} = useGameState();

	const playerList = useMemo(
		() =>
			players?.map((player) => player.playerNumber) ||
			[],
		[players]
	);

	if (!currentPlayer) return <></>;

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
					: `Waiting for ${RESTAURANT_NAMES[currentPlayer.restaurant]}...`}
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
				onClick={alert}
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
