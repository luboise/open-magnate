import { useRecoilState } from "recoil";
import { MoveData } from "../../../shared/Moves";
import { PageGameAtom } from "../pages/Lobby/PageGameContext";
import {
	LeaveLobbyMessage,
	StartGameMessage
} from "../utils";

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

	function makeMove(moveData: MoveData) {
		pageGame.sendMessage({
			type: "MAKE_MOVE",
			data: moveData
		});
	}

	return {
		leaveLobby,
		startGame,
		makeMove
	};
}

export default usePageGame;
