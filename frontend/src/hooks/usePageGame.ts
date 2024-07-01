import { useRecoilState } from "recoil";
import { PageGameAtom } from "../pages/PageGameContext";
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

	return {
		leaveLobby,
		startGame
	};
}

export default usePageGame;
