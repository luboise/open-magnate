import { atom, useRecoilState } from "recoil";
import { HouseView, MapTileData } from "../utils";

type MapRenderListType = Record<string, JSX.Element[]>;

const RECOIL_MAP_RENDER_KEY = "RECOIL_MAP_RENDER_KEY";
const MapRenderAtom = atom<MapRenderListType>({
	key: RECOIL_MAP_RENDER_KEY,
	default: {}
});

const RECOIL_MAP_CALLBACK_LIST: MapClickCallback[] = [];
type MapClickCallback = (
	event: MapObjectClickEvent
) => void | Promise<void>;

// interface Renderable {
// 	x: number;
// 	y: number;
// }

export enum MAP_RENDER_KEYS {
	TILES = "TILES",
	HOUSES = "HOUSES"
}

type MapObjectClickEvent =
	| {
			type: "TILE";
			data: MapTileData;
	  }
	| { type: "HOUSE"; data: HouseView };

function useMap() {
	const [mapRenderList, setMapRenderList] =
		useRecoilState(MapRenderAtom);

	function addRenderable(
		key: string,
		value: JSX.Element | JSX.Element[]
	) {
		if (!mapRenderList[key]) {
			mapRenderList[key] = [];
		}

		if (!Array.isArray(value)) value = [value];

		const newArray = mapRenderList[key].concat(value);
		setMapRenderList({
			...mapRenderList,
			[key]: newArray
		});
	}

	function removeRenderable(
		key: string,
		value: JSX.Element
	) {
		if (mapRenderList[key]) {
			const newList = mapRenderList[key].filter(
				(v) => v !== value
			);

			const newRenderList = { ...mapRenderList };

			if (
				newList.length === newRenderList[key].length
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
	}

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
		event: MapObjectClickEvent
	) {
		for (const callback of RECOIL_MAP_CALLBACK_LIST) {
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

	function onMapObjectClicked(
		callback: (
			event: MapObjectClickEvent
		) => void | Promise<void>
	) {
		RECOIL_MAP_CALLBACK_LIST.push(callback);
	}

	function getAllRenderables() {
		return { ...mapRenderList };
	}

	return {
		addRenderable,
		removeRenderable,
		getRenderList,
		removeRenderList,
		onMapObjectClicked,
		sendMapObjectClickEvent,
		getAllRenderables
	};
}

export default useMap;
