import React from "react";

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA =
	`rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Colour = RGB | RGBA | HEX;

export function GetReactChildId(
	children: React.ReactNode
): string {
	const localKeys = React.Children.toArray(children);

	if (localKeys.length !== 1)
		throw new Error(
			"Resizeable component must have exactly one child"
		);

	const localKeyChild =
		localKeys[0] as React.ReactElement;

	if (!React.isValidElement(localKeyChild))
		throw new Error(
			"Resizeable child must be a valid React element"
		);

	const id = (localKeyChild.props as { id?: string })?.id;
	if (!id)
		throw new Error(
			"Unable to find an id in the child component of a Resizeable component"
		);

	return id;
}

export * from "../../shared";
