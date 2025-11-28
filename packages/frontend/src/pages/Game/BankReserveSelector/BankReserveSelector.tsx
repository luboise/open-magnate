import { HTMLAttributes } from "react"
import Button from "../../../global_components/Button"
import usePageGame from "../../../hooks/game/usePageGame"
import { MoveType } from "magnate-core";

interface Props extends HTMLAttributes<HTMLDivElement> {
	choices: number[]
}

function BankReserveSelector({ choices, ...args }: Props) {

	const { makeMove } = usePageGame();

	function submitChoice(choice: number) {
		makeMove({ moveType: MoveType.SELECT_BANK_RESERVE, reserveAmount: choice });
	}

	return (
		<div style={{
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
		}}{...args}>
			<h2><b>Secretly</b>, select a bank reserve card.</h2>
			<div style={
				{ display: "flex", gap: "1em", justifyContent: "center", padding: 0 }
			}>
				{...choices.map(choice => <Button
					onClick={() => submitChoice(choice)}
					style={{
						width: "5em",
						aspectRatio: "56 / 87",
						border: "1px white solid",
						alignContent: "center",
						padding: "0.5em",
						fontSize: "1.5em",
					}}>${choice}</Button>)}
			</div>
			<p>The total amount of these cards determines the amount of money
				to refill the bank with when it breaks/depletes for the first time.</p>

			<h3>Recommendations</h3>
			<span>$100 - Aggressive play</span>
			<span>$200 - Well rounded play</span>
			<span>$300 - Slow, scaling play</span>
		</div>
	)
}

export default BankReserveSelector
