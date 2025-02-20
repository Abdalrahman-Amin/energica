"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Product, Model, Category } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
      return (
         <div className="container mx-auto px-4 py-16 mt-32">
            <div className="space-y-8">
               <Skeleton className="h-12 w-3/4 mx-auto" />
               <Skeleton className="h-8 w-1/2 mx-auto" />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                     <Skeleton key={i} className="h-64" />
                  ))}
               </div>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-screen"
         >
            <p className="text-red-500 text-lg">{error}</p>
         </motion.div>
      );
   }

   if (!categories.length) {
      return (
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-screen"
         >
            <p className="text-gray-600 text-lg">No categories found.</p>
         </motion.div>
      );
   }

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="min-h-screen bg-gradient-to-b from-white to-gray-50"
      >
         <div className="container mx-auto px-4 py-16 mt-32">
            {/* Hero Section */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="relative mb-16 text-center"
            >
               <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                  Explore{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
                     All Categories
                  </span>
               </h1>
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="absolute inset-x-0 top-1/2 -z-10 transform -translate-y-1/2"
               >
                  <div className="h-[200px] bg-gradient-to-r from-blue-50 via-blue-100/20 to-blue-50 blur-3xl" />
               </motion.div>
            </motion.div>

            {/* Filter Section */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="mb-12"
            >
               <Card>
                  <CardContent className="p-6">
                     <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Model
                           </label>
                           <Select
                              value={selectedModel || ""}
                              onValueChange={(value) =>
                                 setSelectedModel(value || null)
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="All Models" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="all">All Models</SelectItem>
                                 {models.map((model) => (
                                    <SelectItem
                                       key={model.id}
                                       value={String(model.id)}
                                    >
                                       {model.title} (
                                       {modelCategoryMap[model.id] ||
                                          "Unknown Category"}
                                       )
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>

            {/* Categories and Products */}
            <AnimatePresence mode="wait">
               {categoriesWithProductsAndModels.map(
                  ({ category, models }, index) => (
                     <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        id={`category-${category.id}`}
                        className="mb-16"
                     >
                        {/* Category Header */}
                        <motion.div
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           className="relative mb-8"
                        >
                           <h2 className="text-2xl md:text-3xl font-bold text-gray-800 inline-block">
                              {category.title}
                           </h2>
                           <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "5rem" }}
                              transition={{ delay: 0.3 }}
                              className="mt-2 h-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
                           />
                        </motion.div>

                        {/* Models and Products */}
                        {models.map(({ model, products }) => (
                           <ModelSection
                              key={model.id}
                              model={model}
                              products={products}
                              handleWhatsAppClick={handleWhatsAppClick}
                           />
                        ))}
                     </motion.div>
                  )
               )}
            </AnimatePresence>
         </div>
      </motion.div>
   );
};
export default AllCategoriesPage;
