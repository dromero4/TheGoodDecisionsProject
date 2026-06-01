"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PRODUCTS_PER_PAGE = 50;

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function ProductCard({ product }) {
  const content = (
    <>
      <div className="relative h-52 w-full">
        {product.image ? (
          <Image
            src={product.image}
            alt={`Imagen de ${product.name}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-500">
            Sin imagen
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
        className="overflow-hidden rounded-lg border transition-shadow hover:shadow-lg"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border transition-shadow hover:shadow-lg">
      {content}
    </div>
  );
}

export default function ProductsPaginationClient({ products = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [products]);

  const sources = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.source)
          .filter(Boolean)
      ),
    ].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = normalizeText(searchQuery);

    return products.filter((product) => {
      const productName = normalizeText(product.name);
      const productId = normalizeText(product.id);
      const productExternalId = normalizeText(product.externalId);
      const productCategory = normalizeText(product.category);
      const productSource = normalizeText(product.source);

      const matchesSearch =
        !query ||
        productName.includes(query) ||
        productId.includes(query) ||
        productExternalId.includes(query) ||
        productCategory.includes(query) ||
        productSource.includes(query);

      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      const matchesSource =
        selectedSource === "all" ||
        product.source === selectedSource;

      return matchesSearch && matchesCategory && matchesSource;
    });
  }, [products, searchQuery, selectedCategory, selectedSource]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSource]);

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSource("all");
    setCurrentPage(1);
  }

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedSource !== "all";

  return (
    <div className="w-full flex-1 px-6 py-6">
      <div className="mb-5 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, referencia, categoría o proveedor..."
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/40"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/40"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/40"
          >
            <option value="all">Todos los proveedores</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Limpiar
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Mostrando <strong>{paginatedProducts.length}</strong> de{" "}
          <strong>{filteredProducts.length}</strong> producto(s) filtrados.
          {filteredProducts.length !== products.length && (
            <span> Total catálogo: {products.length}</span>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
          No se han encontrado productos con los filtros actuales.
        </div>
      ) : (
        <div className="mr-17 grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="rounded-md border px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>

        <span className="px-4 py-2 text-sm">
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className="rounded-md border px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}