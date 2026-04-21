"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PRODUCTS_PER_PAGE = 50;

function ProductCard({ product }) {
  
  const content = (
    <>
      <div className="relative w-full h-52">

        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-500 capitalize">{product.source}</p>
        <p className="text-sm text-gray-500 capitalize">{product.category}</p>
      </div>
    </>
  );

  if (product.href) {
    return (
      <Link
        href={product.href}
        className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {content}
    </div>
  );
}

export default function ProductsPaginationClient({ products = [] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    return products.slice(start, end);
  }, [products, currentPage]);

  return (
    <div className="p-4">
      <div className="mb-4 text-sm text-gray-600">
        Mostrando {paginatedProducts.length} de {products.length} productos
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 flex-1 mr-17">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        <span className="px-4 py-2 text-sm">
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}