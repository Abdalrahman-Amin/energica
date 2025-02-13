"use client";

import withAdminAuth from "@/components/withAdminAuth";
import Sidebar from "./Sidebar";
import AddCategoryForm from "./CategoryForm";
import AddModelForm from "./ModelForm";
import AddProductForm from "./ProductForm";

import { useRef, useState } from "react";
import CategoryResults from "./CategoryResults";
import ModelsResults from "./ModelResults";
import ProductsResults from "./ProductsResults";
import { Category, Model, Product } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const AdminDashboard = () => {
   const categoryFormRef = useRef<HTMLDivElement>(null);
   const modelFormRef = useRef<HTMLDivElement>(null);
   const productFormRef = useRef<HTMLDivElement>(null);
   const [toggleAddedCategory, setToggleAddedCategory] = useState(false);
   const [toggleAddedModel, setToggleAddedModel] = useState(false);
   const [toggleAddedProduct, setToggleAddedProduct] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState<Category | null>(
      null
   );
   const [selectedModel, setSelectedModel] = useState<Model | null>(null);
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

   const handleScrollTo = (formId: string) => {
      const formRefs: {
         [key: string]: React.RefObject<HTMLDivElement | null>;
      } = {
         "add-category-form": categoryFormRef,
         "add-model-form": modelFormRef,
         "add-product-form": productFormRef,
      };

      formRefs[formId]?.current?.scrollIntoView({ behavior: "smooth" });
   };

   const handleEditCategory = (category: Category) => {
      setSelectedCategory(category);
      handleScrollTo("add-category-form");
   };
   const handleEditModel = (model: Model) => {
      setSelectedModel(model);
      handleScrollTo("add-model-form");
   };

   const handleEditProduct = (product: Product) => {
      setSelectedProduct(product);
      handleScrollTo("add-product-form");
   };
   const clearSelectedCategory = () => {
      setSelectedCategory(null);
   };

   const clearSelectedModel = () => {
      setSelectedModel(null);
   };

   const clearSelectedProduct = () => {
      setSelectedProduct(null);
   };

   const handleLogout = async () => {
      const supabase = createClientComponentClient();
      await supabase.auth.signOut();
      window.location.href = "/admin/login"; // Redirect to login page after logout
   };

   return (
      <div className="flex min-h-screen flex-col md:flex-row">
         {/* Sidebar: Hidden on small screens */}
         <Sidebar onScrollTo={handleScrollTo} />

         <div className="flex-1 flex flex-col gap-4 bg-gray-900 p-4 sm:ml-0 md:ml-64">
            {/* Logout button */}
            <div className="flex justify-end md:justify-end">
               <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-shadow shadow-md"
               >
                  Logout
               </button>
            </div>

            {/* Forms & Results: Responsive grid */}
            <div
               ref={categoryFormRef}
               id="add-category-form"
               className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
               <AddCategoryForm
                  setToggleAddedCategory={() =>
                     setToggleAddedCategory((pre) => !pre)
                  }
                  selectedCategory={selectedCategory}
                  clearSelectedCategory={clearSelectedCategory}
               />
               <CategoryResults
                  toggleAddedCategory={toggleAddedCategory}
                  onEditCategory={handleEditCategory}
               />
            </div>

            <div
               ref={modelFormRef}
               id="add-model-form"
               className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
               <AddModelForm
                  setToggleAddedModel={() => setToggleAddedModel((pre) => !pre)}
                  selectedModel={selectedModel}
                  clearSelectedModel={clearSelectedModel}
               />
               <ModelsResults
                  toggleAddedModel={toggleAddedModel}
                  onEditModel={handleEditModel}
               />
            </div>

            <div
               ref={productFormRef}
               id="add-product-form"
               className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
               <AddProductForm
                  setToggleAddedProduct={() =>
                     setToggleAddedProduct((pre) => !pre)
                  }
                  clearSelectedProduct={clearSelectedProduct}
                  selectedProduct={selectedProduct}
               />
               <ProductsResults
                  toggleAddedProduct={toggleAddedProduct}
                  onEditProduct={handleEditProduct}
               />
            </div>
         </div>
      </div>
   );
};

export default withAdminAuth(AdminDashboard);
