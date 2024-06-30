import { useRef, useState } from "react";
import "./Button.css";

interface ButtonProps
	extends React.HTMLAttributes<HTMLButtonElement> {
	text: string;
	onClick: () => void | Promise<void>;
	inactive?: boolean;
	inactiveHoverText?: string;
}

let idGen = 0;

const Button: React.FC<ButtonProps> = (
	props: ButtonProps
) => {
	const { text, onClick, ...args } = props;

	const [hovering, setHovering] = useState(false);

	const buttonId = useRef(idGen++);

	return (
		<>
			{props.inactiveHoverText ? (
				<label
					className={
						"btn-tooltip" +
						(hovering ? ` btn-show-label` : "")
					}
				>
					{props.inactiveHoverText}
				</label>
			) : (
				<></>
			)}
			<button
				id={String(buttonId)}
				onClick={() => {
					if (props.inactive) return;
					onClick;
				}}
				onMouseEnter={() => setHovering(true)}
				onMouseLeave={() => setHovering(false)}
				{...args}
				type="button"
				className={
					props.inactive ? "btn-inactive" : ""
				}
				// disabled={props.inactive}
			>
				{text}
			</button>
		</>
	);
};

export default Button;
