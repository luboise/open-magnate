import { AreaData, Measurable } from "./Area";

export function GetRealArea(tile: Measurable): AreaData {
    const rotated =
        tile.rotation !== undefined
            ? tile.rotation % 90 === 90
            : false;

    return {
        pos: { ...tile.pos },
        width: rotated ? tile.width : tile.height,
        height: rotated ? tile.height : tile.width
    };
}

export function IsAdjacent(
    m1: Measurable,
    m2: Measurable
): boolean {
    // TODO: Implement the actual adjacency logic

    return true;
}
