import Personalization from "@/app/components/pageComponents/personalization/Personalization";
import ProductGallery from "@/app/components/pageComponents/ProductGallery";
import { getProductById } from "@/app/lib/products.server";
import { notFound } from "next/navigation";



export default async function ProductPage({ params }) {
  const { code } = await params;

  const product = await getProductById(code);

  if (!product) {
    return notFound();
  }

  return (
    <main>
      <ProductGallery product={product} />
    </main>
  );
}
