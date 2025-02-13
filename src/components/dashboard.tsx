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

const AdminDashboard = () => {
   const categoryFormRef = useRef<HTMLDivElement>(null);
   const modelFormRef = useRef<HTMLDivElement>(null);
   const productFormRef = useRef<HTMLDivElement>(null);
   const [toggleAddedCategory, setToggleAddedCategory] = useState(false);
   const [toggleAddedModel, setToggleAddedModel] = useState(false);
   const [toggleAddedProduct, setToggleAddedProduct] = useState(false);

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
   return (
      <div className="flex min-h-screen">
         <Sidebar onScrollTo={handleScrollTo} />
         <div className="flex-1 flex flex-col gap-4 bg-gray-900 ">
            <div
               ref={categoryFormRef}
               id="add-category-form"
               className="flex h-[30rem]"
            >
               <AddCategoryForm
                  setToggleAddedCategory={() =>
                     setToggleAddedCategory((pre) => !pre)
                  }
               />
               <CategoryResults toggleAddedCategory={toggleAddedCategory} />
            </div>
            <div
               ref={modelFormRef}
               id="add-model-form"
               className="flex h-[50rem]"
            >
               <AddModelForm
                  setToggleAddedModel={() => setToggleAddedModel((pre) => !pre)}
               />
               <ModelsResults toggleAddedModel={toggleAddedModel} />
            </div>
            <div
               ref={productFormRef}
               id="add-product-form"
               className="flex h-[50rem]"
            >
               <AddProductForm
                  setToggleAddedProduct={() =>
                     setToggleAddedProduct((pre) => !pre)
                  }
               />
               <ProductsResults toggleAddedProduct={toggleAddedProduct} />
            </div>
         </div>
      </div>
   );
};

export default withAdminAuth(AdminDashboard);
