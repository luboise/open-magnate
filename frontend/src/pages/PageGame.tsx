import { useGameState } from "../hooks/useGameState";

function PageGame(props: { gameId: number | null }) {
	const { newGame, state } = useGameState();

	return (
		<>
			{state ? (
				<button onClick={newGame}>New Game</button>
			) : (
				<div>PageGame</div>
			)}
		</>
	);
}

export default PageGame;
