import { HTMLAttributes } from "react";
import { useGameState } from "../../../hooks/game/useGameState";
interface Props extends HTMLAttributes<HTMLDivElement> {}

function SalaryHandler({ ...args }: Props) {
	const { myEmployees } = useGameState();

	return <div {...args}>SalaryHandler</div>;
}

export default SalaryHandler;

