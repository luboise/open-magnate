import { useRecoilState } from "recoil";
import { PageGameAtom } from "../pages/PageGameContext";
import { LeaveLobbyMessage } from "../utils";

function usePageGame() {
	const [pageGame] = useRecoilState(PageGameAtom);

	function leaveLobby() {
		pageGame.sendMessage({
			type: "LEAVE_LOBBY"
		} as LeaveLobbyMessage);
	}

	return {
		leaveLobby
	};
}

export default usePageGame;
