import { dataSource } from "../../datasource";
import { Restaurant } from "../entity/Restaurant";

const RestaurantRepository =
	dataSource.getRepository(Restaurant);

export default RestaurantRepository;
