import { topTexProducts } from "@/app/lib/toptex/products"

export default async function Personalization(){
    const data = await topTexProducts();
    console.log(data);
    return (
        <h1>Add to cart</h1>
    )
}