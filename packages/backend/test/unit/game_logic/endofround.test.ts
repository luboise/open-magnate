import { MarketingCampaignView } from "magnate-core/networking";
import { FullHouse } from "../../../src/database";
import { TransactionFunctions } from "../../../src/game";

describe("Testing endofround cleanup functions", () => {
	describe("Testing isAffectedByMarketing", () => {
		test("Billboards get adjacent houses", () => {
			const house: FullHouse = {
				x: 3,
				y: 13
			} as FullHouse;

			const campaign: MarketingCampaignView = {
				priority: 14,
				type: "BILLBOARD",
				pos: {
					x: 1,
					y: 13
				}
			} as MarketingCampaignView;

			expect(
				TransactionFunctions.HouseIsAffectedByMarketing(
					house,
					campaign
				)
			).toBeTruthy();
		});
		test("Billboard 15 gets adjacent house to its left", () => {
			const house: FullHouse = {
				x: 1,
				y: 8,
				number: 9
			} as FullHouse;

			const campaign: MarketingCampaignView = {
				priority: 15,
				type: "BILLBOARD",
				pos: {
					x: 3,
					y: 8
				}
			} as MarketingCampaignView;

			expect(
				TransactionFunctions.HouseIsAffectedByMarketing(
					house,
					campaign
				)
			).toBeTruthy();
		});
		test("Billboard 15 gets adjacent bottom house to its left", () => {
			const house: FullHouse = {
				x: 1,
				y: 8,
				number: 9
			} as FullHouse;

			const campaign: MarketingCampaignView = {
				priority: 15,
				type: "BILLBOARD",
				pos: {
					x: 3,
					y: 9
				}
			} as MarketingCampaignView;

			expect(
				TransactionFunctions.HouseIsAffectedByMarketing(
					house,
					campaign
				)
			).toBeTruthy();
		});
		test("Billboard 15 fails when too high (top-right)", () => {
			const house: FullHouse = {
				x: 1,
				y: 8,
				number: 9
			} as FullHouse;

			const campaign: MarketingCampaignView = {
				priority: 15,
				type: "BILLBOARD",
				pos: {
					x: 3,
					y: 7
				}
			} as MarketingCampaignView;

			expect(
				TransactionFunctions.HouseIsAffectedByMarketing(
					house,
					campaign
				)
			).toBeFalsy();
		});
	});
});
