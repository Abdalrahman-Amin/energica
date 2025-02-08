"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Product, Model } from "@/types/types";
import Image from "next/image";

const CategoryProductsPage = () => {
   const { categorySlug } = useParams();
   const [products, setProducts] = useState<Product[]>([]);
   const [models, setModels] = useState<Model[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const supabase = createClientComponentClient();

   useEffect(() => {
      const fetchProductsAndModels = async () => {
         try {
            if (categorySlug) {
               // Fetch category ID by slug
               const { data: categoryData, error: categoryError } =
                  await supabase
                     .from("categories")
                     .select("id")
                     .eq("slug", categorySlug)
                     .single();

               if (categoryError) {
                  throw categoryError;
               }

               const categoryId = categoryData.id;

               // Fetch products by category ID
               const { data: productsData, error: productsError } =
                  await supabase
                     .from("products")
                     .select("*")
                     .eq("category", categoryId);

               if (productsError) {
                  throw productsError;
               }

               setProducts(productsData);

               // Fetch models
               const modelIds = productsData.map((product) => product.model);
               const { data: modelsData, error: modelsError } = await supabase
                  .from("models")
                  .select("*")
                  .in("id", modelIds);

               if (modelsError) {
                  throw modelsError;
               }

               setModels(modelsData);
            }
         } catch (error) {
            console.error("Error fetching products and models:", error);
            setError(
               "Failed to fetch products and models. Please try again later."
            );
         } finally {
            setIsLoading(false);
         }
      };

      fetchProductsAndModels();
   }, [categorySlug, supabase]);

   if (isLoading) {
      return (
         <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="flex justify-center items-center h-screen">
            <p className="text-red-500 text-lg">{error}</p>
         </div>
      );
   }

   if (!products.length) {
      return (
         <div className="flex justify-center items-center h-screen">
            <p className="text-gray-600 text-lg">
               No products found for this category.
            </p>
         </div>
      );
   }

   // Group products by model
   const productsByModel = models.map((model) => ({
      model,
      products: products.filter((product) => product.model === model.id),
   }));

   return (
      <div className="container mx-auto px-4 py-12 mt-56">
         <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Products for Category:{" "}
            <span className="text-blue-600">{categorySlug}</span>
         </h1>
         {productsByModel.map(({ model, products }) => (
            <div key={model.id} className="mb-12">
               <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {model.title}
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                     <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                     >
                        <Image
                           src={product.image}
                           alt={product.title}
                           width={500}
                           height={300}
                           className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                           <h2 className="text-xl font-semibold text-gray-900 mb-2">
                              {product.title}
                           </h2>
                           <p className="text-sm text-gray-600 mb-4">
                              {product.description}
                           </p>
                           <a
                              href={`/product/${product.slug}`}
                              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-center block"
                           >
                              View Details
                           </a>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         ))}
      </div>
   );
};

export default CategoryProductsPage;
