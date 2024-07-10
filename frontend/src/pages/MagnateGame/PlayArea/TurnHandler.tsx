import Button from "../../../components/Button";
import { useGameState } from "../../../hooks/useGameState";

function TurnHandler() {
	const { isMyTurn, turnProgress } = useGameState();

	return (
		<div id="game-turn-handler">
			<Button onClick={alert} />
		</div>
	);
}

export default TurnHandler;

