function Button(props: {
	text: string;
	onClick: () => void | Promise<void>;
}) {
	return (
		<button onClick={props.onClick}>
			{props.text}
		</button>
	);
}

export default Button;
