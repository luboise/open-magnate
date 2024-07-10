import { useMemo } from "react";
import Button from "../../../components/Button";
import { useGameState } from "../../../hooks/useGameState";
import { TURN_PROGRESS_VALUES } from "../../../utils";
import SpinningStatus from "./SpinningStatus";

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

	return (
		<div
			id="game-turn-handler"
			style={{
				backgroundColor: "black",
				position: "fixed",
				bottom: 0,
				right: 0,
				display: "grid"
			}}
		>
			<SpinningStatus
				orderedOptions={TURN_PROGRESS_VALUES}
				currentOption={turnProgress}
				style={{
					gridRow: "1 / span 1",
					gridColumn: "1 / span 1"
				}}
			/>
			<SpinningStatus
				orderedOptions={playerList.map((player) =>
					String(player)
				)}
				currentOption={turnProgress}
				style={{
					gridRow: "2",
					gridColumn: "1"
				}}
			/>
			<Button
				onClick={alert}
				style={{
					gridColumn: "2",
					gridRow: "1 / span 2"
				}}
			/>
		</div>
	);
}

export default TurnHandler;

