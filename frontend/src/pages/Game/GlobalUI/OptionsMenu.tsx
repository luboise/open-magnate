import "./OptionsMenu.css";

import Button from "../../../global_components/Button";
import ModalPanel from "../../../global_components/ModalPanel";
import UIOption from "../../../global_components/UIOption/UIOption";
import useClientOptions, {
	MAX_CARD_WIDTH,
	MIN_CARD_WIDTH,
	useSetClientOptions
} from "../../../hooks/game/useClientOptions";
import useLobbyMessaging from "../../../hooks/game/useLobbyMessaging";

interface Props {
	onClose: () => void | Promise<void>;
}

function OptionsMenu({ onClose }: Props) {
	const { leaveLobby } = useLobbyMessaging();

	const setOption = useSetClientOptions();

	const { employeeCardWidth } = useClientOptions();

	const OPTION_TYPES = [
		"All",
		"UI",
		"Sound",
		"Lobby"
	] as const;

	return (
		<ModalPanel
			id="options-menu-panel"
			className="centered"
			onClose={onClose}
		>
			<div id="options-menu-tabs">
				{...OPTION_TYPES.map((opt) => (
					<Button onClick={() => alert(opt)}>
						{opt}
					</Button>
				))}
			</div>
			<div id="options-menu">
				<UIOption
					optionType="Slider"
					label="Employee Card Width"
					params={{
						defaultValue: employeeCardWidth,
						min: MIN_CARD_WIDTH,
						max: MAX_CARD_WIDTH
					}}
					onUpdate={(val) =>
						setOption("employeeCardWidth", val)
					}
				/>
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
