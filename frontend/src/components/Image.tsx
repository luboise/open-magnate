import { useEffect, useState } from "react";

function Image(props: { url: string }) {
	const [image, setImage] = useState();

	useEffect(() => {
		(async () => {
			try {
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

	return <img src={image} />;
}

export default Image;

