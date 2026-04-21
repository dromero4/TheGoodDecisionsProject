import { getDtgUnitPrice } from "../../components/pageComponents/personalization/availability/pricing.tables.dtg.js";
import { calculatePlacementPrice } from "../../components/pageComponents/personalization/pricing/calculatePlacementPrice.js";

console.log(getDtgUnitPrice("10x10", 1000)); // 2.9435
console.log(getDtgUnitPrice("34.5x49", 500)); // 4.855995