import React, { useEffect, useMemo, useState } from "react";

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
	const { url, ...args } = useMemo(() => props, [props]);
	const [image, setImage] = useState();

	useEffect(() => {
		(async () => {
			try {
				/* @vite-ignore*/
				const image = await import(props.url);
				if (!image)
					throw new Error(
						`Unable to load image from "${props.url}"`
					);

				setImage(image);
			} catch (error) {
				console.error(error);
			}
		})();
	}, []);

	return <img src={image ?? FallbackImage} {...args} />;
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
