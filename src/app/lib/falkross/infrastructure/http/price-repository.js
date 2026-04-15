import {PriceRepository} from "../../domain/repositories/price-repository.js";
import {parse} from "csv-parse/sync";
import {Price} from "../../domain/valueobjects/price.js";

export class HttpPriceRepository extends PriceRepository {
    async getAll() {
        const account = process.env.FALKROSS_API_WEBSERVICE_ACCOUNT;
        const password = process.env.FALKROSS_API_WEBSERVICE_PASSWORD;

        if (!account || !password) {
            throw new Error("Missing Falk&Ross credentials. Set FALKROSS_API_WEBSERVICE_ACCOUNT and FALKROSS_API_WEBSERVICE_PASSWORD.");
        }

        const url = "https://ws.falk-ross.eu/ws/run/price.pl?format=csv&style=&action=get_price";
        const authHeader = `Basic ${Buffer.from(`${account}:${password}`).toString("base64")}`;

        let res = [];

        const response = await fetch(url, {
            headers: {
                Authorization: authHeader,
            },
        });

        if (!response.ok) {
            throw new Error(`failed to fetch prices: ${response.status}`);
        }

        const csvText = await response.text();
        const rows = parse(csvText, {
            columns: true,
            delimiter: ";",
            skip_empty_lines: true,
            trim: true,
        });

        res = rows.map((row) => new Price({
            sku: row.artnr || "",
            defaultPrice: parseFloat(row.default_price) || 0.0,
            price: parseFloat(row.your_price) || 0.0,
            currency: row.currency || "",
        }));

        return res;
    }
}
