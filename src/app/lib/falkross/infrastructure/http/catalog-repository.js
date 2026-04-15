import {CatalogRepository} from "../../domain/repositories/catalog-repository.js";
import {Catalog} from "../../domain/entities/catalog.js";

export class HttpCatalogRepository extends CatalogRepository {
    async getCatalog() {
        const url = "https://download.falk-ross.eu/ws/falkross-stylelist.json";

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`failed to fetch catalog: ${res.status}`);
        }

        const data = await res.json();
        const rawStyles = data?.style_list?.style;
        const styles = Array.isArray(rawStyles)
            ? rawStyles
            : rawStyles
                ? [rawStyles]
                : [];

        let catalog = new Catalog();

        catalog.products = styles
            .map((style) => {
                const url =
                    style?.url_style_json?.$t ??
                    style?.url_style_json ??
                    style?.item?.url_style_json?.$t ??
                    style?.item?.url_style_json;

                return typeof url === "string" ? url.trim() : null;
            })
            .filter((v) => typeof v === "string" && v.length > 0);

        return catalog;
    }
}
