class House {
	private houseNum: number;
	private demand: Array<Food>;
	private demandLimit: number;
	private hasGarden: boolean;

	constructor(num: number) {
		this.houseNum = num;
		this.demand = [];
		this.demandLimit = 3;
		this.hasGarden = false;
	}

	public addDemand(f: Food): boolean {
		if (this.demand.length < this.demandLimit) {
			this.demand.push(f);
			return true;
		}

		return false;
	}

	public setGarden(hasGarden: boolean): void {
		this.hasGarden = hasGarden;
	}
}
