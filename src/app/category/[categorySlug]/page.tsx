"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Product, Model } from "@/types/types";
import Image from "next/image";
import Loader from "@/components/Loader";

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
   const handleWhatsAppClick = ({ product }: { product: Product | null }) => {
      const message = `Hello, I'm interested in the product: ${product?.title}`;
      const phoneNumber = "+2001066651786"; // Replace with your phone number
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
         message
      )}`;
      window.open(url, "_blank");
   };

   if (isLoading) {
      return <Loader size="lg" />;
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
      <div className="container mx-auto px-4 py-10 mt-32">
         <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Explore <span className="text-blue-700">{categorySlug}</span>
         </h1>
         {productsByModel.map(({ model, products }) => (
            <div key={model.id} className="mb-10">
               <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-6 uppercase">
                  {model.title}
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((product) => (
                     <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                     >
                        <a
                           href={product.image}
                           target="_blank"
                           rel="noopener noreferrer"
                        >
                           <Image
                              src={product.image}
                              alt={product.title}
                              width={400}
                              height={250}
                              className="w-full h-40 object-cover cursor-pointer"
                           />
                        </a>
                        <div className="p-4">
                           <div className="flex justify-between items-center">
                              <h2 className="text-lg font-bold text-gray-900">
                                 {product.title}
                              </h2>
                              {product.rating_value && (
                                 <span className="text-sm font-medium text-gray-700">
                                    {product.rating_value} {product.rating_unit}
                                 </span>
                              )}
                           </div>
                           <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                              {product.description}
                           </p>
                           <button
                              onClick={() => handleWhatsAppClick({ product })}
                              className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                           >
                              Contact on WhatsApp
                           </button>
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
