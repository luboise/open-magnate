import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";
import { HouseView, MapTileData } from "../../utils";
import { useGameStateView } from "./useGameState";

type MapRenderListType = Record<string, JSX.Element[]>;

const RECOIL_MAP_RENDER_KEY = "RECOIL_MAP_RENDER_KEY";
const MapRenderAtom = atom<MapRenderListType>({
	key: RECOIL_MAP_RENDER_KEY,
	default: {}
});

const RECOIL_MAP_CLICK_CALLBACK_LIST: MapClickCallback[] =
	[];
const RECOIL_MAP_HOVER_CALLBACK_LIST: MapClickCallback[] =
	[];

type MapClickCallback = (
	event: MapCursorEvent
) => void | Promise<void>;

// interface Renderable {
// 	x: number;
// 	y: number;
// }

export enum MAP_RENDER_KEYS {
	TILES = "TILES",
	HOUSES = "HOUSES"
}

type MapCursorEvent =
	| {
			type: "TILE";
			data: MapTileData;
	  }
	| { type: "HOUSE"; data: HouseView };

// type MouseEvent =
// 	| {
// 			type: "TILE";
// 			data: MapTileData;
// 	  }
// 	| { type: "HOUSE"; data: HouseView };

// type MapObjectHoverEvent =
// 	|

export function useBoardInfo() {
	const { mapRowOrder } = useGameStateView();

	const width = mapRowOrder?.length || 0;
	const height = mapRowOrder?.[0]?.length || 0;

	return {
		width,
		height
	};
}

function useMap() {
	const [mapRenderList, setMapRenderList] =
		useRecoilState(MapRenderAtom);

	const addRenderable = useCallback(
		(
			key: string,
			value: JSX.Element | JSX.Element[]
		) => {
			if (!mapRenderList[key]) {
				mapRenderList[key] = [];
			}

			if (!Array.isArray(value)) value = [value];

			const newArray =
				mapRenderList[key].concat(value);
			setMapRenderList({
				...mapRenderList,
				[key]: newArray
			});
		},
		[]
	);

	const removeRenderable = useCallback(
		(key: string, value: JSX.Element) => {
			if (mapRenderList[key]) {
				const newList = mapRenderList[key].filter(
					(v) => v !== value
				);

				const newRenderList = { ...mapRenderList };

				if (
					newList.length ===
					newRenderList[key].length
				) {
					console.debug(
						"No item was removed from the render list."
					);
					return;
				}
				if (newList.length >= 0)
					delete newRenderList[key];

				setMapRenderList(newRenderList);
			}
		},
		[]
	);

	function getRenderList(key: string) {
		return (mapRenderList[key] || []).map((v) => ({
			...v
		}));
	}

	function removeRenderList(key: string) {
		if (!(key in mapRenderList)) return;

		const newRenderList = { ...mapRenderList };
		delete newRenderList[key];
		setMapRenderList(newRenderList);
	}

	async function sendMapObjectClickEvent(
		event: MapCursorEvent
	) {
		for (const callback of RECOIL_MAP_CLICK_CALLBACK_LIST) {
			try {
				await callback(event);
			} catch (error) {
				console.error(
					"Error occured during map click callback: ",
					error
				);
			}
		}
	}

	async function sendMapObjectHoverEvent(
		event: MapCursorEvent
	) {
		for (const callback of RECOIL_MAP_HOVER_CALLBACK_LIST) {
			try {
				await callback(event);
			} catch (error) {
				console.error(
					"Error occured during map hover callback: ",
					error
				);
			}
		}
	}

	const onMapObjectClicked = useCallback(
		(
			callback: (
				event: MapCursorEvent
			) => void | Promise<void>
		) => {
			RECOIL_MAP_CLICK_CALLBACK_LIST.push(callback);
		},
		[]
	);

	const onMapObjectHovered = useCallback(
		(
			callback: (
				event: MapCursorEvent
			) => void | Promise<void>
		) => {
			RECOIL_MAP_HOVER_CALLBACK_LIST.push(callback);
		},
		[]
	);

	const getAllRenderables = useCallback(() => {
		return { ...mapRenderList };
	}, []);

	return {
		// Renderables
		addRenderable,
		removeRenderable,
		getRenderList,
		removeRenderList,
		getAllRenderables,
		// Mouse events
		onMapObjectClicked,
		onMapObjectHovered,
		sendMapObjectClickEvent,
		sendMapObjectHoverEvent
	};
}

export default useMap;

