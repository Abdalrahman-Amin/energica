"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Product, Model, Category } from "@/types/types";
import Image from "next/image";
import Loader from "@/components/Loader";

const AllCategoriesPage = () => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [models, setModels] = useState<Model[]>([]);
   const [products, setProducts] = useState<Product[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [selectedCategory, setSelectedCategory] = useState<string | null>(
      null
   ); // For category filter
   const [selectedModel, setSelectedModel] = useState<string | null>(null); // For model filter
   const supabase = createClientComponentClient();

   useEffect(() => {
      const fetchAllData = async () => {
         try {
            // Fetch all categories
            const { data: categoriesData, error: categoriesError } =
               await supabase.from("categories").select("*");

            if (categoriesError) {
               throw categoriesError;
            }

            setCategories(categoriesData);

            // Fetch all products
            const { data: productsData, error: productsError } = await supabase
               .from("products")
               .select("*");

            if (productsError) {
               throw productsError;
            }

            setProducts(productsData);

            // Fetch all models
            const modelIds = productsData.map((product) => product.model);
            const { data: modelsData, error: modelsError } = await supabase
               .from("models")
               .select("*")
               .in("id", modelIds);

            if (modelsError) {
               throw modelsError;
            }

            setModels(modelsData);
         } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch data. Please try again later.");
         } finally {
            setIsLoading(false);
         }
      };

      fetchAllData();
   }, [supabase]);

   useEffect(() => {
      const handleHashChange = () => {
         const hash = window.location.hash;
         console.log("DEBUG: ~ handleHashChange ~ hash:", hash);
         if (hash) {
            const element = document.querySelector(hash);
            if (element) {
               const navbarHeight =
                  document.querySelector("header")?.offsetHeight || 0;
               const elementPosition =
                  element.getBoundingClientRect().top + window.pageYOffset;
               const offsetPosition = elementPosition - navbarHeight;

               window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
               });
            }
         }
      };

      // Scroll on initial load
      setTimeout(() => {
         handleHashChange();
      }, 500);

      // Scroll on hash change
      window.addEventListener("hashchange", handleHashChange);

      return () => {
         window.removeEventListener("hashchange", handleHashChange);
      };
   }, [isLoading]);

   const handleWhatsAppClick = ({ product }: { product: Product | null }) => {
      const message = `Hello, I'm interested in the product: ${product?.title}`;
      const phoneNumber = "+2001066651786"; // Replace with your phone number
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
         message
      )}`;
      window.open(url, "_blank");
   };

   // Filter products based on selected category and model
   const filteredProducts = products.filter((product) => {
      const matchesCategory = selectedCategory
         ? product.category === Number(selectedCategory)
         : true;
      const matchesModel = selectedModel
         ? product.model === Number(selectedModel)
         : true;
      return matchesCategory && matchesModel;
   });

   // Group filtered products by model and category
   const categoriesWithProductsAndModels = categories
      .map((category) => {
         const categoryProducts = filteredProducts.filter(
            (product) => product.category === category.id
         );
         const categoryModels = models.filter((model) =>
            categoryProducts.some((product) => product.model === model.id)
         );

         return {
            category,
            models: categoryModels.map((model) => ({
               model,
               products: categoryProducts.filter(
                  (product) => product.model === model.id
               ),
            })),
         };
      })
      .filter(({ models }) => models.length > 0); // Remove categories with no products

   // Create a map of models to their categories
   const modelCategoryMap = models.reduce((map, model) => {
      const product = products.find((p) => p.model === model.id);
      if (product) {
         const category = categories.find((c) => c.id === product.category);
         if (category) {
            map[model.id] = category.title;
         }
      }
      return map;
   }, {} as Record<number, string>);

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

   if (!categories.length) {
      return (
         <div className="flex justify-center items-center h-screen">
            <p className="text-gray-600 text-lg">No categories found.</p>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
         <div className="container mx-auto px-4 py-16 mt-32">
            {/* Hero Section */}
            <div className="relative mb-16 text-center">
               <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                  Explore{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
                     All Categories
                  </span>
               </h1>
               <div className="absolute inset-x-0 top-1/2 -z-10 transform -translate-y-1/2">
                  <div className="h-[200px] bg-gradient-to-r from-blue-50 via-blue-100/20 to-blue-50 blur-3xl opacity-50" />
               </div>
            </div>

            {/* Enhanced Filter Section */}
            <div className="relative mb-12">
               <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex-1">
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                     </label>
                     <select
                        value={selectedCategory || ""}
                        onChange={(e) =>
                           setSelectedCategory(e.target.value || null)
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                     text-gray-700 text-sm
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     hover:border-gray-300 transition-colors duration-200
                     appearance-none cursor-pointer"
                     >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                           <option key={category.id} value={category.id}>
                              {category.title}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="flex-1">
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model
                     </label>
                     <select
                        value={selectedModel || ""}
                        onChange={(e) =>
                           setSelectedModel(e.target.value || null)
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                     text-gray-700 text-sm
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     hover:border-gray-300 transition-colors duration-200
                     appearance-none cursor-pointer"
                     >
                        <option value="">All Models</option>
                        {models.map((model) => (
                           <option key={model.id} value={model.id}>
                              {model.title} (
                              {modelCategoryMap[model.id] || "Unknown Category"}
                              )
                           </option>
                        ))}
                     </select>
                  </div>
               </div>
            </div>

            {/* Categories and Products */}
            {categoriesWithProductsAndModels.map(({ category, models }) => (
               <div
                  key={category.id}
                  id={`category-${category.id}`}
                  className="mb-16"
               >
                  {/* Category Header */}
                  <div className="relative mb-8">
                     <h2 className="text-2xl md:text-3xl font-bold text-gray-800 inline-block">
                        {category.title}
                     </h2>
                     <div className="mt-2 h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full" />
                  </div>

                  {/* Models and Products */}
                  {models.map(({ model, products }) => (
                     <div
                        key={model.id}
                        className="mb-12"
                        id={`model-${model.id}`}
                     >
                        <div className="model-section flex items-center justify-between mb-6">
                           <h3 className="text-xl font-semibold text-gray-700 pl-4 border-l-4 border-blue-500">
                              {model.title}
                           </h3>

                           {/* Scroll Buttons */}
                           {/* <div className="flex gap-2">
                              { (
                                 <button
                                    onClick={(e) => {
                                       const scrollContainer = e.currentTarget
                                          .closest(".model-section")
                                          ?.querySelector(".scroll-container");
                                       if (scrollContainer) {
                                          scrollContainer.scrollLeft -= 300;
                                       }
                                    }}
                                    className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 
            text-gray-600 shadow-sm transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       className="h-5 w-5"
                                       viewBox="0 0 20 20"
                                       fill="currentColor"
                                    >
                                       <path
                                          fillRule="evenodd"
                                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                       />
                                    </svg>
                                 </button>
                              )}
                              {(
                                 <button
                                    onClick={(e) => {
                                       const scrollContainer = e.currentTarget
                                          .closest(".model-section")
                                          ?.querySelector(".scroll-container");
                                       if (scrollContainer) {
                                          scrollContainer.scrollLeft += 300;
                                       }
                                    }}
                                    className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 
            text-gray-600 shadow-sm transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       className="h-5 w-5"
                                       viewBox="0 0 20 20"
                                       fill="currentColor"
                                    >
                                       <path
                                          fillRule="evenodd"
                                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                          clipRule="evenodd"
                                       />
                                    </svg>
                                 </button>
                              )}
                           </div> */}
                        </div>

                        {/* Scrollable container with hidden scrollbar */}
                        <div className="model-section relative -mx-4 px-4">
                           <div className="scroll-container flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 hide-scrollbar::-webkit-scrollbar hide-scrollbar">
                              {products.map((product) => (
                                 <div
                                    key={product.id}
                                    className="group flex-shrink-0 w-[280px] bg-white rounded-xl overflow-hidden transition-all duration-300
              hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
              border border-gray-100 product-card"
                                 >
                                    {/* Image Container */}
                                    <div className="relative h-48 overflow-hidden bg-gray-50">
                                       <a
                                          href={product.image}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block h-full w-full"
                                       >
                                          <Image
                                             src={product.image}
                                             alt={product.title}
                                             width={280}
                                             height={192}
                                             className="w-full h-full object-cover transition-transform duration-300 
                    group-hover:scale-105"
                                          />
                                       </a>
                                       {product.rating_value && (
                                          <div
                                             className="absolute top-3 right-3 px-2 py-1 rounded-lg 
                  bg-white/90 backdrop-blur-sm 
                  text-xs font-medium text-gray-700
                  shadow-sm"
                                          >
                                             {product.rating_value}{" "}
                                             {product.rating_unit}
                                          </div>
                                       )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 space-y-3">
                                       {/* Title and Description */}
                                       <div className="space-y-1.5">
                                          <h4 className="font-semibold text-gray-900 leading-tight">
                                             {product.title}
                                          </h4>
                                          <p className="text-xs text-gray-600 line-clamp-2">
                                             {product.description}
                                          </p>
                                       </div>

                                       {/* Buttons Container */}
                                       <div className="flex gap-2">
                                          {/* WhatsApp Button */}
                                          <button
                                             onClick={() =>
                                                handleWhatsAppClick({ product })
                                             }
                                             className="flex-1 inline-flex items-center justify-center
                  bg-gradient-to-r from-green-500 to-green-600
                  text-white py-1.5 px-3 rounded-lg
                  text-xs font-medium
                  transition-all duration-200
                  hover:from-green-600 hover:to-green-700
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                                          >
                                             <svg
                                                viewBox="0 0 24 24"
                                                className="w-3.5 h-3.5 mr-1.5 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                             >
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                             </svg>
                                             WhatsApp
                                          </button>

                                          {/* Data Sheet Download Button */}
                                          {product.data_sheet && (
                                             <a
                                                href={product.data_sheet}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 inline-flex items-center justify-center
                     bg-gradient-to-r from-blue-500 to-blue-600
                     text-white py-1.5 px-3 rounded-lg
                     text-xs font-medium
                     transition-all duration-200
                     hover:from-blue-600 hover:to-blue-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                             >
                                                <svg
                                                   className="w-3.5 h-3.5 mr-1.5"
                                                   fill="none"
                                                   stroke="currentColor"
                                                   viewBox="0 0 24 24"
                                                   xmlns="http://www.w3.org/2000/svg"
                                                >
                                                   <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                   />
                                                </svg>
                                                Data Sheet
                                             </a>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ))}
         </div>
      </div>
   );
};

export default AllCategoriesPage;
