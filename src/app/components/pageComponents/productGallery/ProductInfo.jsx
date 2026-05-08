import ProductAccordion from "../../ProductAccordion";

export default function ProductInfo({ product, price }) {
  return (
    <main className="mb-5">
      <div className="text-3xl font-bold">
        {product?.externalId} - {product?.name}
      </div>

      <div>{product?.shortDescription}</div>

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
        {product?.longDescription}
      </ProductAccordion>
    </main>
  );
}