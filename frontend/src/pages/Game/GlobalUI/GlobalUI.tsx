import GlobalReserveDisplay from "../Reserve/GlobalReserveDisplay";
import PlayerInventory from "./PlayerInventory";
import TurnHandler from "./TurnHandler";
import WindowToolbar, {
	ToolbarType
} from "./WindowToolbar";

type Props = {
	reserveEnabledOnDefault: boolean;
	onToggleableClicked: (
		toggleable: ToggleableType
	) => void | Promise<void>;
};

function GlobalUI({
	reserveEnabledOnDefault,
	onToggleableClicked
}: Props) {
	return (
		<>
			<WindowToolbar
				onClick={(clicked) =>
					onToggleableClicked(clicked)
				}
			/>

			<GlobalReserveDisplay
				enabledByDefault={reserveEnabledOnDefault}
				onToggle={() =>
					onToggleableClicked("GLOBAL RESERVE")
				}
			/>

			<TurnHandler />

			<PlayerInventory />
		</>
	);
}

export default GlobalUI;
export type ToggleableType =
	| ToolbarType
	| NonToolbarToggleType;
export type NonToolbarToggleType = "GLOBAL RESERVE";
