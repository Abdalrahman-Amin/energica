"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Product, Model, Category } from "@/types/types";
import Loader from "@/components/ui/Loader";
import { ModelSection } from "@/components/ModelSection";

const AllCategoriesPage = () => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [models, setModels] = useState<Model[]>([]);
   const [products, setProducts] = useState<Product[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [selectedCategory] = useState<string | null>(null); // For category filter
   const [selectedModel, setSelectedModel] = useState<string | null>(null); // For model filter
   const supabase = createClientComponentClient();

   useEffect(() => {
      const fetchAllData = async () => {
         try {
            setIsLoading(true);
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
         if (hash) {
            const element = document.querySelector(hash);
            if (element) {
               const navbarHeight =
                  document.querySelector("header")?.offsetHeight || 0;
               const elementPosition =
                  element.getBoundingClientRect().top + window.pageYOffset;
               let offsetPosition;
               if (hash.startsWith("#category")) {
                  offsetPosition = elementPosition - navbarHeight;
               } else {
                  offsetPosition = elementPosition - navbarHeight - 200;
               }

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
      }, 1000);

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
                     <ModelSection
                        key={model.id}
                        model={model}
                        products={products}
                        handleWhatsAppClick={handleWhatsAppClick}
                     />
                  ))}
               </div>
            ))}
         </div>
      </div>
   );
};

export default AllCategoriesPage;
