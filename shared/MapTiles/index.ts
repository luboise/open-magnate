import { MarketingTile } from "./MarketingTiles";
import { RestaurantTile } from "./RestaurantTiles";

export * from "./MapPieceTiles";
export * from "./MarketingTiles";
export * from "./RestaurantTiles";
export * from "./Tile";

export type MapOverlayTile = MarketingTile | RestaurantTile;

