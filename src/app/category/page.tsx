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
      <div className="container mx-auto px-4 py-10 mt-32">
         <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Explore All Categories
         </h1>

         {/* Filter Section */}
         <div className="flex flex-wrap gap-4 mb-8">
            <select
               value={selectedCategory || ""}
               onChange={(e) => setSelectedCategory(e.target.value || null)}
               className="p-2 border border-gray-300 rounded-md"
            >
               <option value="">All Categories</option>
               {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                     {category.title}
                  </option>
               ))}
            </select>

            <select
               value={selectedModel || ""}
               onChange={(e) => setSelectedModel(e.target.value || null)}
               className="p-2 border border-gray-300 rounded-md"
            >
               <option value="">All Models</option>
               {models.map((model) => (
                  <option key={model.id} value={model.id}>
                     {model.title} (
                     {modelCategoryMap[model.id] || "Unknown Category"})
                  </option>
               ))}
            </select>
         </div>

         {/* Display Filtered Products */}
         {categoriesWithProductsAndModels.map(({ category, models }) => (
            <div key={category.id} className="mb-10">
               <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-6 uppercase">
                  {category.title}
               </h2>
               {models.map(({ model, products }) => (
                  <div key={model.id} className="mb-8">
                     <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        {model.title}
                     </h3>
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
                                          {product.rating_value}{" "}
                                          {product.rating_unit}
                                       </span>
                                    )}
                                 </div>
                                 <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                    {product.description}
                                 </p>
                                 <button
                                    onClick={() =>
                                       handleWhatsAppClick({ product })
                                    }
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
         ))}
      </div>
   );
};

export default AllCategoriesPage;
