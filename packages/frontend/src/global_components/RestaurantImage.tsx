import React from "react";
import Image from "./Image";

interface RestaurantImageProps
	extends React.ImgHTMLAttributes<HTMLImageElement> {
	restaurantIndex: number;
}

// "Xango Blues Bar",
// 	"Santa Maria Pizza",
// 	"Fried Geese and Donkey",
// 	"Gluttony Inc. Burgers",
// 	"Golden Duck Diner",
// 	"Siap Faji Bar"

function RestaurantImage(props: RestaurantImageProps) {
	const { restaurantIndex: restaurantNumber, ...args } = props;
	const imageUrl = `/resources/restaurants/${restaurantNumber}.png`;

	return <Image url={imageUrl} {...args} />;
}

export default RestaurantImage;
