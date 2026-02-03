import Link from "next/link";
import { getProducts } from "../lib/products.server";
import Image from "next/image";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 flex-1 mr-17">
      {products.map((product) => (
        <Link
            key={product.id}
            href={`/product/${product.externalId}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        > 
            <div className="md:w-full md:h-50 relative w-full h-50">
                {product.images[0] ? (
                    <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="h-full bg-gray-200 flex items-center justify-center">
                        No Image
                    </div>
                )}
            </div>
            <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
            </div>
        </Link>
      ))}
    </div>
  )
}