import { useRef, useState } from "react";
import "./Button.css";

interface ButtonProps
	extends React.HTMLAttributes<HTMLButtonElement> {
	onClick: () => void | Promise<void>;
	inactive?: boolean;
	inactiveHoverText?: string;
	children?: React.ReactNode;
}

let idGen = 0;

const Button: React.FC<ButtonProps> = (
	props: ButtonProps
) => {
	const {
		onClick,
		children,
		inactive,
		inactiveHoverText,
		...args
	} = props;

	const [hovering, setHovering] = useState(false);

	const buttonId = useRef(idGen++);

	return (
		<>
			{inactive && inactiveHoverText ? (
				<label
					className={
						"btn-tooltip" +
						(hovering ? ` btn-show-label` : "")
					}
				>
					{inactiveHoverText}
				</label>
			) : (
				<></>
			)}
			<button
				id={String(buttonId)}
				onClick={() => {
					if (inactive) return;
					onClick();
				}}
				onMouseEnter={() => setHovering(true)}
				onMouseLeave={() => setHovering(false)}
				type="button"
				className={
					props.inactive ? "btn-inactive" : ""
				}
				{...args}
				// disabled={props.inactive}
			>
				{children}
			</button>
		</>
	);
};

export default Button;
