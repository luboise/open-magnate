interface ButtonProps
	extends React.HTMLAttributes<HTMLButtonElement> {
	text: string;
	onClick: () => void | Promise<void>;
}

const Button: React.FC<ButtonProps> = (
	props: ButtonProps
) => {
	const { text, onClick, ...args } = props;

	return (
		<button onClick={onClick} {...args} type="button">
			{text}
		</button>
	);
};

export default Button;
