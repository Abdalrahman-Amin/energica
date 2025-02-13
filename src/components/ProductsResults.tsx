"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Loader from "@/components/Loader";
import { Product } from "@/types/types";

const ProductsResults = ({
   toggleAddedProduct,
}: {
   toggleAddedProduct: boolean;
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
      <div className="container mx-auto px-4 py-12 bg-gray-900 min-h-screen w-[50rem]">
         <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Products
         </h1>
         <div className="bg-gray-50 shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
               <table className="min-w-full border-collapse">
                  <thead className="bg-gray-200 border-b sticky top-0">
                     <tr className="flex w-full">
                        <th className="py-4 px-6 text-left font-semibold text-gray-700 w-1/2">
                           Title
                        </th>
                        <th className="py-4 px-6 text-center font-semibold text-gray-700 w-1/2">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <div className="h-[30rem] overflow-y-auto block w-full custom-scrollbar">
                     <tbody className="block w-full">
                        {products.map((product) => (
                           <tr
                              key={product.id}
                              className="flex w-full border-b hover:bg-gray-100 transition"
                           >
                              <td className="py-4 px-6 w-1/2 text-gray-800">
                                 {product.title}
                              </td>
                              <td className="py-4 px-6 text-center w-1/2">
                                 <button
                                    onClick={() => handleDelete(product.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-shadow shadow-md"
                                 >
                                    Delete
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </div>
               </table>
            </div>
         </div>
      </div>
   );
};

export default ProductsResults;
