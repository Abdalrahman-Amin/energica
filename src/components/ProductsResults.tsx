"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Loader from "@/components/ui/Loader";
import { Product } from "@/types/types";

interface ProductsResultsProps {
   toggleAddedProduct: boolean;
   onEditProduct: (product: Product) => void;
}

const ProductsResults: React.FC<ProductsResultsProps> = ({
   toggleAddedProduct,
   onEditProduct,
}) => {
   const [products, setProducts] = useState<Product[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const supabase = createClientComponentClient();

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const { data, error } = await supabase.from("products").select("*");
            if (error) throw error;
            setProducts(data);
         } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to fetch products. Please try again later.");
         } finally {
            setIsLoading(false);
         }
      };

      fetchProducts();
   }, [supabase, toggleAddedProduct]);

   const handleDelete = async (id: number) => {
      const confirmDelete = confirm(
         "Are you sure you want to delete this product?"
      );
      if (!confirmDelete) return;

      try {
         const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);
         if (error) throw error;
         setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
         console.error("Error deleting product:", error);
         setError("Failed to delete product. Please try again later.");
      }
   };

   if (isLoading) return <Loader />;

   if (error) {
      return (
         <div className="flex justify-center items-center h-screen">
            <p className="text-red-500 text-lg">{error}</p>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-6 bg-gray-900 min-h-screen w-full max-w-4xl">
         <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
            Products
         </h1>
         <div className="bg-gray-50 shadow-lg rounded-xl overflow-hidden">
            {/* Scrollable container for better mobile UX */}
            <div className="overflow-x-auto">
               <table className="min-w-full border-collapse">
                  <thead className="bg-gray-200 border-b sticky top-0">
                     <tr className="grid grid-cols-1 sm:grid-cols-2 w-full">
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                           Title
                        </th>
                        <th className="py-3 px-4 text-center font-semibold text-gray-700">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="block w-full h-[15rem] overflow-y-auto">
                     {products.map((product) => (
                        <tr
                           key={product.id}
                           className="grid grid-cols-1 sm:grid-cols-2 border-b hover:bg-gray-100 transition"
                        >
                           <td className="py-3 px-4 text-gray-800">
                              {product.title}
                           </td>
                           <td className="py-3 px-4 flex flex-col sm:flex-row justify-center gap-2">
                              <button
                                 onClick={() => onEditProduct(product)}
                                 className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                              >
                                 Edit
                              </button>
                              <button
                                 onClick={() => handleDelete(product.id)}
                                 className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                              >
                                 Delete
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

export default ProductsResults;
