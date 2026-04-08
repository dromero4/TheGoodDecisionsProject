import Image from "next/image";

export default function ToptexProducts({ products = [] }) {
  return (
    <>
      {products.map((product) => {
        const src = typeof product?.image === "string" && product.image.trim() ? product.image : null;
        const alt =
          typeof product?.name === "string" && product.name.trim()
            ? product.name
            : "Product image";

        return (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full h-52">
              {src ? (
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
              ) : (
                // ✅ placeholder cuando no hay imagen (evita error de src vacío)
                <div
                  className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500"
                  aria-label={alt}
                >
                  No image
                </div>
              )}
            </div>

            <div className="px-4 py-2">
              <h2 className="text-lg font-semibold">{product?.name ?? "Unnamed product"}</h2>
            </div>
          </div>
        );
      })}
    </>
  );
}