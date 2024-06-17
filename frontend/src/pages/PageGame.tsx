import { useGameState } from "../hooks/useGameState";
import useTriggeredCallback from "../hooks/useTriggeredCallback";

function PageGame(props: { gameId: number | null }) {
	const { newGame, state } = useGameState();
	const [triggerNewGame] = useTriggeredCallback(newGame);

	console.debug("Current state: ", state);

	return (
		<>
			{state ? (
				<div>PageGame</div>
			) : (
				<button onClick={triggerNewGame}>
					New Game
				</button>
			)}
		</>
	);
}

export default PageGame;
