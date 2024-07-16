import React, { useState } from "react";

interface ImageProps
	extends React.ImgHTMLAttributes<HTMLImageElement> {
	url: string;
}

import FallbackImage from "/resources/FALLBACK.png";
if (!FallbackImage)
	throw new Error(
		"Unable to load FallbackImage. This must be fixed."
	);

const Image: React.FC<ImageProps> = (props: ImageProps) => {
	const { url, ...args } = props;
	const [validImage, setValidImage] = useState(true);

	return (
		<img
			src={validImage ? url : FallbackImage}
			{...args}
			onError={() => {
				setValidImage(false);
			}}
		/>
	);
};

export default Image;

// interface ButtonProps
// 	extends React.HTMLAttributes<HTMLButtonElement> {
// 	text: string;
// 	onClick: () => void | Promise<void>;
// }

// const Button: React.FC<ButtonProps> = (
// 	props: ButtonProps
// ) => {
// 	const { text, onClick, ...args } = props;

// 	return (
// 		<button onClick={onClick} {...args}>
// 			{text}
// 		</button>
// 	);
// };

// export default Button;
