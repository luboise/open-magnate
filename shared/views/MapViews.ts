import {
    DEMAND_TYPE,
    Position
} from "../../backend/src/dataViews";
import { FullHouse } from "../../backend/src/database/controller/includes";

export interface RestaurantView {
    pos: Position;
    player: number;
}

export interface HouseView {
    priority: number;
    demandLimit: number;

    pos: Position;

    demand: DEMAND_TYPE[];
    garden: GardenView | null;
}

export function CreateHouseView(
    house: FullHouse
): HouseView {
    return {
        demand: house.demand.map((demand) => demand.type),
        demandLimit: house.demandLimit,
        priority: house.number,
        pos: {
            x: house.x,
            y: house.y,
            orientation: "HORIZONTAL"
        },
        garden: house.garden
            ? {
                houseNumber: house.garden?.houseId,
                pos: {
                    x: house.garden.x,
                    y: house.garden.y,
                    orientation:
                        house.garden?.orientation
                }
            }
            : null
    };
}

export interface GardenView {
    pos: Position;
    houseNumber: number;
}
