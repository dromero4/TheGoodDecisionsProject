
// import Image from "next/image";
// import Link from "next/link";

// export default function StanleyProducts({ products }) {
//     return (

//         products.map((product) => (
//     <Link
//     key={product.id}
//     href={`/product/${product.externalId}`}
//     className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
//         > 
//             <div className="md:w-full md:h-50 relative w-full h-50">
//                 {product.images[0] ? (
//                     <Image
//                         src={product.images[0].url}
//                         alt={product.name}
//                         fill
//                         className="object-cover"
//                     />
//                 ) : (
//                     <div className="h-full bg-gray-200 flex items-center justify-center">
//                         No Image
//                     </div>
//                 )}
//             </div>
//             <div className="p-4">
//                 <h2 className="text-lg font-semibold">{product.name}</h2>
//             </div>
//         </Link>
//       ))
//     )
// }