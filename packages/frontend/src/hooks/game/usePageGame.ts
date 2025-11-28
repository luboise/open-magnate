import {
	LeaveLobbyMessage,
	MakeMoveMessage,
	Move,
	StartGameMessage
} from "magnate-core";
import { useRecoilState } from "recoil";
import { PageGameAtom } from "../../pages/Lobby/PageGameContext";

function usePageGame() {
	const [pageGame] = useRecoilState(PageGameAtom);

	function leaveLobby() {
		pageGame.sendMessage({
			type: "LEAVE_LOBBY"
		} as LeaveLobbyMessage);
	}

	function startGame() {
		pageGame.sendMessage({
			type: "START_GAME"
		} as StartGameMessage);
	}

	function makeMove(moveData: Move) {
		pageGame.sendMessage({
			type: "MAKE_MOVE",
			data: moveData
		} satisfies MakeMoveMessage);
	}

	return {
		leaveLobby,
		startGame,
		makeMove
	};
}

export default usePageGame;
