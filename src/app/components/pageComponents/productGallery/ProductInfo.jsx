import ProductAccordion from "../../ProductAccordion";

import { shortDescriptionTranslations, longDescriptionLineTranslations } from "../../../lib/translations/apiTranslations";

export default function ProductInfo({ product, price }) {
  return (
    <main className="mb-5">
      <div className="text-3xl font-bold">
        {product?.externalId} - {product?.name}
      </div>

      <div>{translateShortDescription(product.shortDescription)}</div>

      <div className="mt-2 text-3xl font-semibold">
        {price ? (
          <>{Number(price.gt10).toFixed(2)} €</>
        ) : (
          <span className="text-sm opacity-60">
            Por favor, selecciona el tamaño y el color primero
          </span>
        )}
      </div>

      <ProductAccordion title="Description">
        {translateLongDescription(product?.longDescription)}
      </ProductAccordion>
    </main>
  );
}

export function translateShortDescription(description) {
  if (!description) return "";
  return shortDescriptionTranslations[description] || description;
}

export function translateLongDescription(description) {
  if (!description) return "";

  return description
    .split("\n")
    .map((line) => {
      const cleanLine = line.trim();

      if (!cleanLine) return "";

      return longDescriptionLineTranslations[cleanLine] || cleanLine;
    })
    .filter(Boolean)
    .join("\n");
}