export function buildProductJsonUrl(productId) {
    const [catalogId, jsonId] = productId.split("//");

    if (!catalogId || !jsonId) {
        throw new Error(`Invalid productId format: ${productId}`);
    }

    return `https://download.falk-ross.eu/ws/${catalogId}/json/${jsonId}.json`;
}

export default async function getProduct(productId) {
    const productUrl = buildProductJsonUrl(productId);

    const res = await fetch(productUrl);

    if (!res.ok) {
        throw new Error(`Error al descargar JSON: ${res.status}`);
    }

    const data = await res.json();

    return data;
}
