import "./OptionsMenu.css";

import Button from "../../../global_components/Button";
import ModalPanel from "../../../global_components/ModalPanel";
import useLobbyMessaging from "../../../hooks/game/useLobbyMessaging";

interface Props {
	onClose: () => void | Promise<void>;
}

function OptionsMenu({ onClose }: Props) {
	const { leaveLobby } = useLobbyMessaging();

	const OPTION_TYPES = [
		"All",
		"UI",
		"Sound",
		"Lobby"
	] as const;

	return (
		<ModalPanel onClose={onClose} id="options-menu">
			<div id="options-menu-tabs">
				{OPTION_TYPES.map((opt) => (
					<Button onClick={() => alert(opt)}>
						{opt}
					</Button>
				))}
			</div>
			<div>
				<div>option 1, option 2, option 3</div>
				<Button onClick={leaveLobby}>
					Leave Lobby
				</Button>
			</div>
			OptionsMenu
		</ModalPanel>
	);
}

export default OptionsMenu;
